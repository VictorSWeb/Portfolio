import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes import health_router, router
from app.clients.github import GitHubClient
from app.core.errors import APIError
from app.schemas.api import ErrorResponse, ValidationIssue

logger = logging.getLogger(__name__)


def create_app(
    *,
    transport: httpx.AsyncBaseTransport | None = None,
    timeout: float = 10.0,
) -> FastAPI:
    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
        github_client = GitHubClient(transport=transport, timeout=timeout)
        application.state.github_client = github_client
        try:
            yield
        finally:
            await github_client.aclose()

    application = FastAPI(
        title="GitHub Analytics API",
        description=(
            "Analyze public GitHub profiles and repositories using the official "
            "GitHub REST API."
        ),
        version="1.0.0",
        docs_url="/docs",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )
    application.include_router(health_router)
    application.include_router(router)

    @application.exception_handler(APIError)
    async def api_error_handler(_: Request, error: APIError) -> JSONResponse:
        body = ErrorResponse(
            error={"code": error.code, "message": error.message}
        )
        return JSONResponse(
            status_code=error.status_code,
            content=body.model_dump(mode="json", exclude_none=True),
            headers=error.headers,
        )

    @application.exception_handler(RequestValidationError)
    async def request_validation_error_handler(
        _: Request,
        error: RequestValidationError,
    ) -> JSONResponse:
        details = [
            ValidationIssue(
                location=[part for part in issue["loc"]],
                message=issue["msg"],
                type=issue["type"],
            )
            for issue in error.errors()
        ]
        body = ErrorResponse(
            error={
                "code": "validation_error",
                "message": "Request validation failed.",
                "details": details,
            }
        )
        return JSONResponse(
            status_code=422,
            content=body.model_dump(mode="json", exclude_none=True),
        )

    @application.exception_handler(StarletteHTTPException)
    async def http_error_handler(
        _: Request,
        error: StarletteHTTPException,
    ) -> JSONResponse:
        code, message = (
            ("route_not_found", "Route not found.")
            if error.status_code == 404
            else ("http_error", "The request could not be completed.")
        )
        body = ErrorResponse(error={"code": code, "message": message})
        return JSONResponse(
            status_code=error.status_code,
            content=body.model_dump(mode="json", exclude_none=True),
            headers=error.headers,
        )

    @application.exception_handler(Exception)
    async def unexpected_error_handler(_: Request, error: Exception) -> JSONResponse:
        logger.error(
            "Unhandled API error",
            exc_info=(type(error), error, error.__traceback__),
        )
        body = ErrorResponse(
            error={
                "code": "internal_error",
                "message": "An unexpected error occurred.",
            }
        )
        return JSONResponse(
            status_code=500,
            content=body.model_dump(mode="json", exclude_none=True),
        )

    return application


app = create_app()
