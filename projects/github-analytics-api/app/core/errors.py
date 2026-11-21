from collections.abc import Mapping


class APIError(Exception):
    def __init__(
        self,
        *,
        status_code: int,
        code: str,
        message: str,
        headers: Mapping[str, str] | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.headers = dict(headers) if headers else None


class GitHubUserNotFoundError(APIError):
    def __init__(self) -> None:
        super().__init__(
            status_code=404,
            code="github_user_not_found",
            message="The requested GitHub user was not found.",
        )


class GitHubRateLimitError(APIError):
    def __init__(self, *, headers: Mapping[str, str] | None = None) -> None:
        super().__init__(
            status_code=429,
            code="github_rate_limit_exceeded",
            message="The GitHub API rate limit has been exceeded. Try again later.",
            headers=headers,
        )


class GitHubUnavailableError(APIError):
    def __init__(self) -> None:
        super().__init__(
            status_code=503,
            code="github_unavailable",
            message="The GitHub API is temporarily unavailable.",
        )


class GitHubUpstreamError(APIError):
    def __init__(self) -> None:
        super().__init__(
            status_code=502,
            code="github_request_failed",
            message="The GitHub API could not complete the request.",
        )


class GitHubResponseError(APIError):
    def __init__(self) -> None:
        super().__init__(
            status_code=502,
            code="github_invalid_response",
            message="The GitHub API returned an invalid response.",
        )


class IncompleteGitHubDataError(APIError):
    def __init__(self) -> None:
        super().__init__(
            status_code=502,
            code="incomplete_github_data",
            message=(
                "GitHub returned an incomplete repository list; "
                "a complete summary could not be computed."
            ),
        )


class SummaryRepositoryLimitError(APIError):
    def __init__(self) -> None:
        super().__init__(
            status_code=422,
            code="summary_repository_limit_exceeded",
            message=(
                "The summary endpoint supports users with up to 5,000 "
                "public repositories."
            ),
        )
