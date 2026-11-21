from collections.abc import Callable
from typing import AsyncContextManager
from urllib.parse import parse_qs, urlparse

import httpx
import pytest

from app.main import create_app

pytestmark = pytest.mark.anyio

GitHubHandler = Callable[[httpx.Request], httpx.Response]
TestClientContext = Callable[[GitHubHandler], AsyncContextManager[httpx.AsyncClient]]


def user_payload(*, public_repos: int = 2) -> dict[str, object]:
    return {
        "login": "octocat",
        "name": "The Octocat",
        "bio": "A test profile",
        "location": "San Francisco",
        "company": "@github",
        "html_url": "https://github.com/octocat",
        "public_repos": public_repos,
        "followers": 100,
        "following": 10,
        "created_at": "2011-01-25T18:44:36Z",
    }


def repository_payload(
    repository_id: int,
    name: str,
    *,
    language: str | None = "Python",
    stars: int = 0,
    forks: int = 0,
    is_fork: bool = False,
    created_at: str = "2021-01-01T00:00:00Z",
    updated_at: str = "2024-01-01T00:00:00Z",
) -> dict[str, object]:
    return {
        "id": repository_id,
        "name": name,
        "full_name": f"octocat/{name}",
        "description": f"{name} description",
        "language": language,
        "stargazers_count": stars,
        "forks_count": forks,
        "html_url": f"https://github.com/octocat/{name}",
        "created_at": created_at,
        "updated_at": updated_at,
        "fork": is_fork,
    }


def json_response(
    data: object,
    *,
    status_code: int = 200,
    headers: dict[str, str] | None = None,
) -> httpx.Response:
    return httpx.Response(status_code, json=data, headers=headers)


async def test_health_check(client_for: TestClientContext) -> None:
    def unexpected_request(request: httpx.Request) -> httpx.Response:
        raise AssertionError(f"Health check made an unexpected request: {request.url}")

    async with client_for(unexpected_request) as client:
        response = await client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_profile_success(client_for: TestClientContext) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/users/octocat"
        assert request.headers["accept"] == "application/vnd.github+json"
        assert request.headers["x-github-api-version"] == "2022-11-28"
        assert request.headers["user-agent"] == "github-analytics-api"
        return json_response(user_payload())

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/profile")

    assert response.status_code == 200
    assert response.json() == {
        "login": "octocat",
        "name": "The Octocat",
        "bio": "A test profile",
        "location": "San Francisco",
        "company": "@github",
        "profile_url": "https://github.com/octocat",
        "public_repositories": 2,
        "followers": 100,
        "following": 10,
        "created_at": "2011-01-25T18:44:36Z",
    }


async def test_unknown_user_returns_standardized_404(
    client_for: TestClientContext,
) -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return json_response({"message": "Not Found"}, status_code=404)

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/missing/profile")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "github_user_not_found",
            "message": "The requested GitHub user was not found.",
        }
    }


async def test_repository_listing_forwards_pagination_and_sort(
    client_for: TestClientContext,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/users/octocat/repos"
        assert parse_qs(urlparse(str(request.url)).query) == {
            "page": ["2"],
            "per_page": ["5"],
            "sort": ["full_name"],
            "direction": ["asc"],
            "type": ["owner"],
        }
        return json_response(
            [
                repository_payload(
                    7,
                    "hello-world",
                    language="Python",
                    stars=8,
                    forks=3,
                    is_fork=True,
                )
            ]
        )

    async with client_for(handler) as client:
        response = await client.get(
            "/api/v1/users/octocat/repositories",
            params={
                "page": 2,
                "per_page": 5,
                "sort": "full_name",
                "direction": "asc",
            },
        )

    assert response.status_code == 200
    assert response.json() == {
        "username": "octocat",
        "page": 2,
        "per_page": 5,
        "sort": "full_name",
        "direction": "asc",
        "repositories": [
            {
                "name": "hello-world",
                "description": "hello-world description",
                "language": "Python",
                "stars": 8,
                "forks": 3,
                "url": "https://github.com/octocat/hello-world",
                "created_at": "2021-01-01T00:00:00Z",
                "updated_at": "2024-01-01T00:00:00Z",
                "is_fork": True,
            }
        ],
    }


async def test_summary_aggregates_all_repository_pages(
    client_for: TestClientContext,
) -> None:
    first_page = [
        repository_payload(1, "alpha", stars=5, forks=2, updated_at="2023-01-01T00:00:00Z"),
        repository_payload(
            2,
            "beta",
            language="TypeScript",
            stars=2,
            forks=1,
            is_fork=True,
            updated_at="2024-01-01T00:00:00Z",
        ),
    ]
    second_page = [
        repository_payload(
            3,
            "gamma",
            language=None,
            stars=4,
            updated_at="2022-01-01T00:00:00Z",
        )
    ]
    requested_pages: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return json_response(user_payload(public_repos=3))
        assert request.url.path == "/users/octocat/repos"
        requested_pages.append(request.url.params["page"])
        if request.url.params["page"] == "1":
            return json_response(
                first_page,
                headers={
                    "Link": (
                        "<https://api.github.com/users/octocat/repos"
                        "?per_page=100&page=2>; rel=\"next\""
                    )
                },
            )
        if request.url.params["page"] == "2":
            return json_response(second_page)
        return json_response([])

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/summary")

    assert response.status_code == 200
    assert requested_pages == ["1", "2"]
    assert response.json() == {
        "username": "octocat",
        "total_public_repositories": 3,
        "total_stars": 11,
        "total_forks": 3,
        "original_repositories": 2,
        "forked_repositories": 1,
        "repositories_by_language": {"Python": 1, "TypeScript": 1},
        "most_starred_repository": {
            "name": "alpha",
            "url": "https://github.com/octocat/alpha",
            "stars": 5,
            "updated_at": "2023-01-01T00:00:00Z",
        },
        "most_recently_updated_repository": {
            "name": "beta",
            "url": "https://github.com/octocat/beta",
            "stars": 2,
            "updated_at": "2024-01-01T00:00:00Z",
        },
        "statistics_complete": True,
    }


async def test_summary_for_user_without_repositories(
    client_for: TestClientContext,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return json_response(user_payload(public_repos=0))
        assert request.url.path == "/users/octocat/repos"
        assert request.url.params["page"] == "1"
        return json_response([])

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/summary")

    assert response.status_code == 200
    assert response.json() == {
        "username": "octocat",
        "total_public_repositories": 0,
        "total_stars": 0,
        "total_forks": 0,
        "original_repositories": 0,
        "forked_repositories": 0,
        "repositories_by_language": {},
        "most_starred_repository": None,
        "most_recently_updated_repository": None,
        "statistics_complete": True,
    }


async def test_missing_repository_dates_are_returned_as_null(
    client_for: TestClientContext,
) -> None:
    repository = repository_payload(1, "undated", language=None)
    repository.pop("created_at")
    repository.pop("updated_at")

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return json_response(user_payload(public_repos=1))
        if request.url.params["page"] == "1":
            return json_response([repository])
        return json_response([])

    async with client_for(handler) as client:
        summary = await client.get("/api/v1/users/octocat/summary")
        page = await client.get("/api/v1/users/octocat/repositories")

    assert summary.status_code == 200
    assert summary.json()["most_starred_repository"]["updated_at"] is None
    assert summary.json()["most_recently_updated_repository"] is None
    assert summary.json()["repositories_by_language"] == {}
    assert page.status_code == 200
    assert page.json()["repositories"][0]["created_at"] is None
    assert page.json()["repositories"][0]["updated_at"] is None


async def test_summary_verifies_an_exact_full_page_boundary(
    client_for: TestClientContext,
) -> None:
    repositories = [
        repository_payload(repository_id, f"repo-{repository_id}")
        for repository_id in range(1, 101)
    ]
    requested_pages: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return json_response(user_payload(public_repos=100))
        requested_pages.append(request.url.params["page"])
        if request.url.params["page"] == "1":
            return json_response(repositories)
        if request.url.params["page"] == "2":
            return json_response([])
        raise AssertionError(f"Unexpected repository page: {request.url}")

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/summary")

    assert response.status_code == 200
    assert requested_pages == ["1", "2"]
    assert response.json()["total_public_repositories"] == 100


async def test_summary_rejects_users_over_the_documented_limit(
    client_for: TestClientContext,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.url.path == "/users/octocat"
        return json_response(user_payload(public_repos=5_001))

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/summary")

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "summary_repository_limit_exceeded"


async def test_incomplete_repository_list_is_not_reported_as_a_summary(
    client_for: TestClientContext,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return json_response(user_payload(public_repos=2))
        return json_response([repository_payload(1, "only-one")])

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/summary")

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "incomplete_github_data"
    assert "incomplete repository list" in response.json()["error"]["message"]


async def test_duplicate_ids_across_pages_are_not_reported_as_complete(
    client_for: TestClientContext,
) -> None:
    duplicate_repository = repository_payload(1, "same-repository")

    def handler(request: httpx.Request) -> httpx.Response:
        if request.url.path == "/users/octocat":
            return json_response(user_payload(public_repos=2))
        if request.url.params["page"] == "1":
            return json_response(
                [duplicate_repository],
                headers={
                    "Link": (
                        "<https://api.github.com/users/octocat/repos"
                        "?per_page=100&page=2>; rel=\"next\""
                    )
                },
            )
        return json_response([duplicate_repository])

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/summary")

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "incomplete_github_data"


@pytest.mark.parametrize(
    ("status_code", "headers", "payload"),
    [
        (
            403,
            {"X-RateLimit-Remaining": "0"},
            {"message": "API rate limit exceeded"},
        ),
        (
            403,
            {},
            {"message": "You have exceeded a secondary rate limit."},
        ),
        (429, {}, {"message": "Too many requests"}),
        (429, {"Retry-After": "30"}, {"message": "Too many requests"}),
    ],
)
async def test_rate_limit_is_reported_as_429(
    client_for: TestClientContext,
    status_code: int,
    headers: dict[str, str],
    payload: dict[str, str],
) -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(status_code, json=payload, headers=headers)

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/profile")

    assert response.status_code == 429
    assert response.json()["error"]["code"] == "github_rate_limit_exceeded"
    assert payload["message"] not in response.text
    assert response.headers.get("Retry-After") == headers.get("Retry-After")


async def test_upstream_server_error_is_reported_without_upstream_details(
    client_for: TestClientContext,
) -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return json_response({"message": "internal upstream detail"}, status_code=500)

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/profile")

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "github_unavailable"
    assert "internal upstream detail" not in response.text


async def test_network_error_is_reported_as_unavailable(
    client_for: TestClientContext,
) -> None:
    def handler(request: httpx.Request) -> httpx.Response:
        raise httpx.ConnectError("private connection detail", request=request)

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/profile")

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "github_unavailable"
    assert "private connection detail" not in response.text


@pytest.mark.parametrize(
    "payload",
    [
        {"unexpected": "shape"},
        {
            **user_payload(),
            "public_repos": "not-an-integer",
        },
    ],
)
async def test_unexpected_github_profile_response_is_reported(
    client_for: TestClientContext,
    payload: dict[str, object],
) -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return json_response(payload)

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/profile")

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "github_invalid_response"


async def test_unexpected_repository_response_is_reported(
    client_for: TestClientContext,
) -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return json_response({"repositories": []})

    async with client_for(handler) as client:
        response = await client.get("/api/v1/users/octocat/repositories")

    assert response.status_code == 502
    assert response.json()["error"]["code"] == "github_invalid_response"


@pytest.mark.parametrize(
    "query",
    [
        {"page": 0},
        {"per_page": 101},
        {"sort": "stars"},
        {"direction": "sideways"},
    ],
)
async def test_invalid_repository_parameters_return_standardized_422(
    client_for: TestClientContext,
    query: dict[str, object],
) -> None:
    def unexpected_request(request: httpx.Request) -> httpx.Response:
        raise AssertionError(f"Invalid query reached GitHub: {request.url}")

    async with client_for(unexpected_request) as client:
        response = await client.get(
            "/api/v1/users/octocat/repositories",
            params=query,
        )

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"
    assert response.json()["error"]["details"]


async def test_invalid_username_is_rejected(
    client_for: TestClientContext,
) -> None:
    def unexpected_request(request: httpx.Request) -> httpx.Response:
        raise AssertionError(f"Invalid username reached GitHub: {request.url}")

    async with client_for(unexpected_request) as client:
        response = await client.get("/api/v1/users/-invalid/profile")

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


async def test_openapi_and_swagger_are_available(
    client_for: TestClientContext,
) -> None:
    def unexpected_request(request: httpx.Request) -> httpx.Response:
        raise AssertionError(f"Docs made an unexpected GitHub request: {request.url}")

    async with client_for(unexpected_request) as client:
        swagger = await client.get("/docs")
        openapi = await client.get("/openapi.json")

    assert swagger.status_code == 200
    assert "swagger-ui" in swagger.text
    assert openapi.status_code == 200
    paths = openapi.json()["paths"]
    assert "/api/health" in paths
    assert "/api/v1/users/{username}/profile" in paths
    assert "/api/v1/users/{username}/repositories" in paths
    assert "/api/v1/users/{username}/summary" in paths
    assert "422" in paths["/api/v1/users/{username}/summary"]["get"]["responses"]
    assert "500" in paths["/api/v1/users/{username}/summary"]["get"]["responses"]


async def test_unhandled_application_error_does_not_leak_details() -> None:
    def unexpected_request(request: httpx.Request) -> httpx.Response:
        raise AssertionError(f"Unexpected GitHub request: {request.url}")

    application = create_app(transport=httpx.MockTransport(unexpected_request))

    @application.get("/test-internal-error")
    async def raise_unexpected_error() -> None:
        raise RuntimeError("private path C:\\private\\app.py")

    async with application.router.lifespan_context(application):
        async with httpx.AsyncClient(
            transport=httpx.ASGITransport(
                app=application,
                raise_app_exceptions=False,
            ),
            base_url="http://testserver",
        ) as client:
            response = await client.get("/test-internal-error")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "code": "internal_error",
            "message": "An unexpected error occurred.",
        }
    }
    assert "C:\\private\\app.py" not in response.text
