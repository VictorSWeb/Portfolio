from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Path, Query, Request

from app.clients.github import GitHubClient
from app.schemas.api import (
    ErrorResponse,
    HealthResponse,
    RepositoryPageResponse,
    UserProfileResponse,
    UserSummaryResponse,
)
from app.services.analytics import build_summary, to_profile, to_repository

health_router = APIRouter()
router = APIRouter(prefix="/api/v1")
UsernamePath = Annotated[
    str,
    Path(
        min_length=1,
        max_length=39,
        pattern=r"^(?:[A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]{0,37}[A-Za-z0-9])$",
    ),
]


@health_router.get(
    "/api/health",
    response_model=HealthResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Check API health",
)
async def read_health() -> HealthResponse:
    return HealthResponse(status="ok")


def get_github_client(request: Request) -> GitHubClient:
    return request.app.state.github_client


@router.get(
    "/users/{username}/profile",
    response_model=UserProfileResponse,
    responses={
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    summary="Get a public GitHub user profile",
)
async def read_profile(
    username: UsernamePath,
    github: Annotated[GitHubClient, Depends(get_github_client)],
) -> UserProfileResponse:
    user = await github.get_user(username)
    return to_profile(user)


@router.get(
    "/users/{username}/repositories",
    response_model=RepositoryPageResponse,
    responses={
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    summary="List a user's public repositories",
)
async def read_repositories(
    username: UsernamePath,
    github: Annotated[GitHubClient, Depends(get_github_client)],
    page: Annotated[int, Query(ge=1)] = 1,
    per_page: Annotated[int, Query(ge=1, le=100)] = 10,
    sort: Annotated[
        Literal["created", "updated", "pushed", "full_name"], Query()
    ] = "updated",
    direction: Annotated[Literal["asc", "desc"], Query()] = "desc",
) -> RepositoryPageResponse:
    repositories = await github.list_repositories(
        username,
        page=page,
        per_page=per_page,
        sort=sort,
        direction=direction,
    )
    return RepositoryPageResponse(
        username=username,
        page=page,
        per_page=per_page,
        sort=sort,
        direction=direction,
        repositories=[to_repository(repository) for repository in repositories],
    )


@router.get(
    "/users/{username}/summary",
    response_model=UserSummaryResponse,
    responses={
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        502: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    summary="Summarize a user's public repositories",
)
async def read_summary(
    username: UsernamePath,
    github: Annotated[GitHubClient, Depends(get_github_client)],
) -> UserSummaryResponse:
    user = await github.get_user(username)
    repositories = await github.get_all_repositories(
        username,
        expected_count=user.public_repos,
    )
    return build_summary(user, repositories)
