from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict


class APIModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class HealthResponse(APIModel):
    status: Literal["ok"]


class UserProfileResponse(APIModel):
    login: str
    name: str | None
    bio: str | None
    location: str | None
    company: str | None
    profile_url: str
    public_repositories: int
    followers: int
    following: int
    created_at: AwareDatetime


class RepositoryResponse(APIModel):
    name: str
    description: str | None
    language: str | None
    stars: int
    forks: int
    url: str
    created_at: AwareDatetime | None
    updated_at: AwareDatetime | None
    is_fork: bool


class RepositoryPageResponse(APIModel):
    username: str
    page: int
    per_page: int
    sort: Literal["created", "updated", "pushed", "full_name"]
    direction: Literal["asc", "desc"]
    repositories: list[RepositoryResponse]


class RepositoryHighlight(APIModel):
    name: str
    url: str
    stars: int
    updated_at: AwareDatetime | None


class UserSummaryResponse(APIModel):
    username: str
    total_public_repositories: int
    total_stars: int
    total_forks: int
    original_repositories: int
    forked_repositories: int
    repositories_by_language: dict[str, int]
    most_starred_repository: RepositoryHighlight | None
    most_recently_updated_repository: RepositoryHighlight | None
    statistics_complete: Literal[True] = True


class ValidationIssue(APIModel):
    location: list[str | int]
    message: str
    type: str


class ErrorBody(APIModel):
    code: str
    message: str
    details: list[ValidationIssue] | None = None


class ErrorResponse(APIModel):
    error: ErrorBody
