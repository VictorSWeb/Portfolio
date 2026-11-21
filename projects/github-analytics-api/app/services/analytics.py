from collections import Counter

from app.schemas.api import (
    RepositoryHighlight,
    RepositoryResponse,
    UserProfileResponse,
    UserSummaryResponse,
)
from app.schemas.github import GitHubRepository, GitHubUser


def to_profile(user: GitHubUser) -> UserProfileResponse:
    return UserProfileResponse(
        login=user.login,
        name=user.name,
        bio=user.bio,
        location=user.location,
        company=user.company,
        profile_url=user.html_url,
        public_repositories=user.public_repos,
        followers=user.followers,
        following=user.following,
        created_at=user.created_at,
    )


def to_repository(repository: GitHubRepository) -> RepositoryResponse:
    return RepositoryResponse(
        name=repository.name,
        description=repository.description,
        language=repository.language,
        stars=repository.stargazers_count,
        forks=repository.forks_count,
        url=repository.html_url,
        created_at=repository.created_at,
        updated_at=repository.updated_at,
        is_fork=repository.fork,
    )


def build_summary(
    user: GitHubUser,
    repositories: list[GitHubRepository],
) -> UserSummaryResponse:
    language_counts = Counter(
        repository.language
        for repository in repositories
        if repository.language is not None
    )
    most_starred = (
        min(
            repositories,
            key=lambda repository: (
                -repository.stargazers_count,
                repository.name.casefold(),
            ),
        )
        if repositories
        else None
    )
    dated_repositories = [
        repository for repository in repositories if repository.updated_at is not None
    ]
    most_recently_updated = (
        max(dated_repositories, key=lambda repository: repository.updated_at)
        if dated_repositories
        else None
    )

    return UserSummaryResponse(
        username=user.login,
        total_public_repositories=user.public_repos,
        total_stars=sum(repository.stargazers_count for repository in repositories),
        total_forks=sum(repository.forks_count for repository in repositories),
        original_repositories=sum(not repository.fork for repository in repositories),
        forked_repositories=sum(repository.fork for repository in repositories),
        repositories_by_language=dict(sorted(language_counts.items())),
        most_starred_repository=_to_highlight(most_starred),
        most_recently_updated_repository=_to_highlight(most_recently_updated),
    )


def _to_highlight(
    repository: GitHubRepository | None,
) -> RepositoryHighlight | None:
    if repository is None:
        return None
    return RepositoryHighlight(
        name=repository.name,
        url=repository.html_url,
        stars=repository.stargazers_count,
        updated_at=repository.updated_at,
    )
