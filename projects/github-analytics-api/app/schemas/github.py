from pydantic import AwareDatetime, BaseModel, ConfigDict, Field


class GitHubModel(BaseModel):
    model_config = ConfigDict(extra="ignore")


class GitHubUser(GitHubModel):
    login: str
    name: str | None = None
    bio: str | None = None
    location: str | None = None
    company: str | None = None
    html_url: str
    public_repos: int = Field(ge=0, strict=True)
    followers: int = Field(ge=0, strict=True)
    following: int = Field(ge=0, strict=True)
    created_at: AwareDatetime


class GitHubRepository(GitHubModel):
    id: int = Field(gt=0, strict=True)
    name: str
    description: str | None = None
    language: str | None = None
    stargazers_count: int = Field(ge=0, strict=True)
    forks_count: int = Field(ge=0, strict=True)
    html_url: str
    created_at: AwareDatetime | None = None
    updated_at: AwareDatetime | None = None
    fork: bool
