from collections.abc import Mapping
from math import ceil
from typing import Any, Literal

import httpx
from pydantic import ValidationError

from app.core.errors import (
    GitHubRateLimitError,
    GitHubResponseError,
    GitHubUnavailableError,
    GitHubUpstreamError,
    GitHubUserNotFoundError,
    IncompleteGitHubDataError,
    SummaryRepositoryLimitError,
)
from app.schemas.github import GitHubRepository, GitHubUser

GITHUB_API_URL = "https://api.github.com"
REPOSITORY_PAGE_SIZE = 100
MAX_SUMMARY_REPOSITORIES = 5_000
MAX_SUMMARY_PAGES = ceil(MAX_SUMMARY_REPOSITORIES / REPOSITORY_PAGE_SIZE) + 1


class GitHubClient:
    def __init__(
        self,
        *,
        transport: httpx.AsyncBaseTransport | None = None,
        timeout: float = 10.0,
    ) -> None:
        self._http = httpx.AsyncClient(
            base_url=GITHUB_API_URL,
            headers={
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
                "User-Agent": "github-analytics-api",
            },
            timeout=timeout,
            transport=transport,
        )

    async def aclose(self) -> None:
        await self._http.aclose()

    async def get_user(self, username: str) -> GitHubUser:
        payload, _ = await self._request_json("GET", f"/users/{username}")
        try:
            return GitHubUser.model_validate(payload)
        except ValidationError as error:
            raise GitHubResponseError() from error

    async def list_repositories(
        self,
        username: str,
        *,
        page: int,
        per_page: int,
        sort: Literal["created", "updated", "pushed", "full_name"] = "updated",
        direction: Literal["asc", "desc"] = "desc",
    ) -> list[GitHubRepository]:
        repositories, _ = await self._list_repositories_page(
            username,
            page=page,
            per_page=per_page,
            sort=sort,
            direction=direction,
        )
        return repositories

    async def _list_repositories_page(
        self,
        username: str,
        *,
        page: int,
        per_page: int,
        sort: Literal["created", "updated", "pushed", "full_name"],
        direction: Literal["asc", "desc"],
    ) -> tuple[list[GitHubRepository], bool]:
        payload, has_next_page = await self._request_json(
            "GET",
            f"/users/{username}/repos",
            params={
                "page": page,
                "per_page": per_page,
                "sort": sort,
                "direction": direction,
                "type": "owner",
            },
        )
        if not isinstance(payload, list):
            raise GitHubResponseError()
        try:
            repositories = [
                GitHubRepository.model_validate(item) for item in payload
            ]
        except ValidationError as error:
            raise GitHubResponseError() from error
        return repositories, has_next_page

    async def get_all_repositories(
        self,
        username: str,
        *,
        expected_count: int,
    ) -> list[GitHubRepository]:
        if expected_count > MAX_SUMMARY_REPOSITORIES:
            raise SummaryRepositoryLimitError()

        repositories: list[GitHubRepository] = []
        end_of_list_observed = False

        for page in range(1, MAX_SUMMARY_PAGES + 1):
            batch, has_next_page = await self._list_repositories_page(
                username,
                page=page,
                per_page=REPOSITORY_PAGE_SIZE,
                sort="full_name",
                direction="asc",
            )
            if not batch:
                end_of_list_observed = True
                break
            repositories.extend(batch)
            if len(repositories) > expected_count:
                break
            if not has_next_page and len(batch) < REPOSITORY_PAGE_SIZE:
                end_of_list_observed = True
                break

        unique_ids = {repository.id for repository in repositories}
        if (
            not end_of_list_observed
            or len(repositories) != expected_count
            or len(unique_ids) != expected_count
        ):
            raise IncompleteGitHubDataError()
        return repositories

    async def _request_json(
        self,
        method: str,
        path: str,
        *,
        params: Mapping[str, str | int] | None = None,
    ) -> tuple[Any, bool]:
        try:
            response = await self._http.request(method, path, params=params)
        except httpx.RequestError as error:
            raise GitHubUnavailableError() from error

        if response.status_code == 404:
            raise GitHubUserNotFoundError()

        payload: Any = None
        try:
            payload = response.json()
        except ValueError:
            if response.is_success:
                raise GitHubResponseError()

        if self._is_rate_limited(response, payload):
            retry_after = response.headers.get("Retry-After")
            headers = (
                {"Retry-After": retry_after}
                if retry_after is not None and retry_after.isdigit()
                else None
            )
            raise GitHubRateLimitError(headers=headers)
        if response.status_code >= 500:
            raise GitHubUnavailableError()
        if not response.is_success:
            raise GitHubUpstreamError()
        try:
            has_next_page = "next" in response.links
        except ValueError as error:
            raise GitHubResponseError() from error
        return payload, has_next_page

    @staticmethod
    def _is_rate_limited(response: httpx.Response, payload: Any) -> bool:
        if response.status_code == 429:
            return True
        if response.status_code != 403:
            return False
        if response.headers.get("X-RateLimit-Remaining") == "0":
            return True
        if not isinstance(payload, dict):
            return False
        message = payload.get("message")
        return isinstance(message, str) and "rate limit" in message.casefold()
