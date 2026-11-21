from collections.abc import AsyncGenerator, Callable
from contextlib import asynccontextmanager
from typing import AsyncContextManager

import httpx
import pytest

from app.main import create_app

GitHubHandler = Callable[[httpx.Request], httpx.Response]
TestClientContext = Callable[[GitHubHandler], AsyncContextManager[httpx.AsyncClient]]


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture
def client_for() -> TestClientContext:
    @asynccontextmanager
    async def create_client(
        handler: GitHubHandler,
    ) -> AsyncGenerator[httpx.AsyncClient, None]:
        application = create_app(transport=httpx.MockTransport(handler))
        async with application.router.lifespan_context(application):
            async with httpx.AsyncClient(
                transport=httpx.ASGITransport(app=application),
                base_url="http://testserver",
            ) as client:
                yield client

    return create_client
