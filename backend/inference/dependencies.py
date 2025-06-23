from fastapi import Depends
from typing import Annotated

from cloudflare.client import R2Client
from .service import InferenceService, inference_service


async def get_r2_client() -> R2Client:
    """Dependency to get R2 client."""
    return R2Client()


async def get_inference_service() -> InferenceService:
    """Dependency to get inference service."""
    return inference_service


# Type aliases for cleaner dependency injection
R2ClientDep = Annotated[R2Client, Depends(get_r2_client)]
InferenceServiceDep = Annotated[InferenceService, Depends(get_inference_service)]
