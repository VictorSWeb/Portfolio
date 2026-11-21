# GitHub Analytics API

A small, asynchronous REST API for exploring public GitHub profiles and analyzing their public repositories. It uses the official GitHub REST API and does not require a GitHub token for basic use.

## Features

- Retrieve public profile details.
- List public repositories with pagination and sorting.
- Calculate repository, star, fork, and language statistics.
- Identify the most-starred and most recently updated repositories.
- Validate inputs and return consistent JSON errors.
- Generate interactive Swagger UI and OpenAPI documentation.
- Test external GitHub API behavior using HTTP mocks; tests do not need internet access or credentials.

## Technologies

- Python 3.11+
- FastAPI and Pydantic
- HTTPX for asynchronous GitHub API requests
- Uvicorn
- Pytest and AnyIO for asynchronous endpoint tests

## Architecture

```text
app/
  api/routes.py          HTTP endpoints and request validation
  clients/github.py      GitHub REST client, pagination, and response validation
  core/errors.py         Safe, consistent application and upstream errors
  schemas/api.py         Public API response models
  schemas/github.py      Validated GitHub response models
  services/analytics.py  Response mapping and repository statistics
  main.py                FastAPI application, lifecycle, and error handlers
tests/
  conftest.py            Mock GitHub transport and ASGI test fixture
  test_api.py            Endpoint, analytics, validation, and error tests
```

The application creates one HTTPX client during its lifespan and closes it on shutdown. Routes use the client through the application state; aggregation logic remains separate from transport and HTTP concerns.

## Installation

Use Python 3.11 or newer. From this directory, create and activate a virtual environment, then install the project dependencies:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

macOS or Linux:

```bash
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## Run locally

From `projects/github-analytics-api/`:

```bash
python -m uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`. Interactive Swagger UI is at `http://127.0.0.1:8000/docs`; the OpenAPI document is at `http://127.0.0.1:8000/openapi.json`.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Check application health without contacting GitHub. |
| GET | `/api/v1/users/{username}/profile` | Retrieve public profile details. |
| GET | `/api/v1/users/{username}/repositories` | List public repositories. |
| GET | `/api/v1/users/{username}/summary` | Analyze all public repositories and calculate aggregate statistics. |

### Repository query parameters

| Parameter | Default | Constraints |
| --- | --- | --- |
| `page` | `1` | Integer greater than or equal to 1. |
| `per_page` | `10` | Integer from 1 to 100. |
| `sort` | `updated` | `created`, `updated`, `pushed`, or `full_name`. |
| `direction` | `desc` | `asc` or `desc`. |

### Example requests

```bash
curl http://127.0.0.1:8000/api/health
curl http://127.0.0.1:8000/api/v1/users/octocat/profile
curl "http://127.0.0.1:8000/api/v1/users/octocat/repositories?page=1&per_page=5&sort=updated&direction=desc"
curl http://127.0.0.1:8000/api/v1/users/octocat/summary
```

### Example profile response

Values returned by GitHub can change; this shows the response shape:

```json
{
  "login": "octocat",
  "name": "The Octocat",
  "bio": null,
  "location": null,
  "company": null,
  "profile_url": "https://github.com/octocat",
  "public_repositories": 8,
  "followers": 10000,
  "following": 9,
  "created_at": "2011-01-25T18:44:36Z"
}
```

### Example repository response

```json
{
  "username": "octocat",
  "page": 1,
  "per_page": 5,
  "sort": "updated",
  "direction": "desc",
  "repositories": [
    {
      "name": "example",
      "description": "Example repository",
      "language": "Python",
      "stars": 42,
      "forks": 7,
      "url": "https://github.com/octocat/example",
      "created_at": "2022-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "is_fork": false
    }
  ]
}
```

### Summary behavior

The summary endpoint supports users with up to 5,000 public repositories. It requests up to 100 repositories per page in alphabetical order and follows GitHub's `Link` pagination header. A short page without a `next` link, or an empty page, marks the end of the list. The API returns `statistics_complete: true` only when the observed list has the expected number of unique repositories and pagination reached the end. Users over the limit receive `422` with `summary_repository_limit_exceeded`; count mismatches, duplicate IDs, or pagination that does not reach the end receive `502` with `incomplete_github_data`.

Language counts include repositories with a non-null primary language. Star and fork totals are sums across the user's public repositories returned by GitHub. The most-starred repository uses its star count; ties are resolved by repository name in ascending alphabetical order. Repository creation and update timestamps that GitHub omits or returns as `null` are returned as `null`; repositories without an update timestamp are not eligible for the most-recently-updated highlight. Users with no public repositories receive zero totals and `null` repository highlights.

Example summary response:

```json
{
  "username": "octocat",
  "total_public_repositories": 8,
  "total_stars": 123,
  "total_forks": 45,
  "original_repositories": 6,
  "forked_repositories": 2,
  "repositories_by_language": {
    "JavaScript": 3,
    "Python": 2
  },
  "most_starred_repository": {
    "name": "example",
    "url": "https://github.com/octocat/example",
    "stars": 100,
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "most_recently_updated_repository": {
    "name": "example",
    "url": "https://github.com/octocat/example",
    "stars": 100,
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "statistics_complete": true
}
```

The values are illustrative; live data is retrieved from GitHub at request time.

## Error handling

Errors use a consistent JSON envelope:

```json
{
  "error": {
    "code": "github_user_not_found",
    "message": "The requested GitHub user was not found."
  }
}
```

| Status | Meaning |
| --- | --- |
| `404` | The GitHub user was not found, or the requested route does not exist. |
| `422` | Username or query parameter validation failed, or the user's repository count exceeds the summary limit. |
| `429` | GitHub reported a primary or secondary rate limit. A numeric `Retry-After` header is forwarded when supplied. |
| `502` | GitHub returned an invalid response, a request failed upstream, or repository pagination did not yield a complete unique list. |
| `503` | GitHub is unavailable or the network request failed. |
| `500` | An unexpected application error occurred; the public response does not include internal details. |

Validation errors return `422` and include safe field locations and messages. Unexpected application errors are logged server-side and returned without stack traces or internal details.

## GitHub API rate limits

Unauthenticated requests are subject to GitHub's public REST API rate limits (commonly 60 requests per hour per originating IP; GitHub may change these limits). The API requires no token for basic requests and maps GitHub rate-limit responses to `429`. A summary makes one profile request plus repository-page requests (up to 51 page requests for a user at the 5,000-repository limit), so large profiles use more of the available quota. No retries or cache are configured.

## Known limitations

- Data is read from the public GitHub REST API at request time. Statistics depend on the data GitHub makes available at that moment and are not persisted.
- Private repositories and other private account information are not accessible.
- GitHub does not provide an atomic snapshot across paginated requests. The summary checks the profile count, unique repository IDs, and pagination completion, but repository changes during pagination can still make a cross-page snapshot inconsistent.
- Summary analytics are limited to users with at most 5,000 public repositories and 51 repository-page requests; larger profiles receive `422` rather than partial totals.
- GitHub's unauthenticated rate limit is shared according to GitHub's policy and may prevent requests until the limit resets.
- This project has no database, authentication, or background processing.

## Run tests

From this directory:

```bash
python -m pytest
```

The tests use HTTPX mock transports with an ASGI transport and AnyIO, and cover health, profile and repository endpoints, pagination boundaries, sorting, complete and empty summaries, missing dates, validation, upstream errors, rate limits, unexpected payloads, and OpenAPI/Swagger. They do not make real network requests.
