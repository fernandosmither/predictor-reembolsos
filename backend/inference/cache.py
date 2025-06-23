import pickle
from pathlib import Path
from typing import Any, Optional
from fastapi import HTTPException

from cloudflare.client import R2Client


class ModelCache:
    """Cache service for machine learning models with R2 backend."""

    def __init__(self, cache_dir: str = "/tmp/model_cache"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self._cache: dict[str, Any] = {}
        self._r2_client: Optional[R2Client] = None

    def _get_r2_client(self) -> R2Client:
        """Get or create R2 client."""
        if self._r2_client is None:
            self._r2_client = R2Client()
        return self._r2_client

    def _get_cache_path(self, model_name: str) -> Path:
        """Get the local cache path for a model."""
        return self.cache_dir / f"{model_name}.pkl"

    async def _download_model(self, model_name: str) -> Any:
        """Download model from R2 and save to cache."""
        try:
            r2_client = self._get_r2_client()
            model_bytes = await r2_client.download_file(model_name)

            # Save to local cache
            cache_path = self._get_cache_path(model_name)
            with open(cache_path, "wb") as f:
                f.write(model_bytes)

            # Load and return model
            model = pickle.loads(model_bytes)
            self._cache[model_name] = model
            return model

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to download model {model_name}: {str(e)}",
            )

    async def get_model(self, model_name: str) -> Any:
        """Get model from cache or download from R2."""
        # Check in-memory cache first
        if model_name in self._cache:
            return self._cache[model_name]

        # Check local file cache
        cache_path = self._get_cache_path(model_name)
        if cache_path.exists():
            try:
                with open(cache_path, "rb") as f:
                    model = pickle.load(f)
                self._cache[model_name] = model
                return model
            except Exception:
                # If cache is corrupted, remove it and download fresh
                cache_path.unlink(missing_ok=True)

        # Download from R2
        return await self._download_model(model_name)

    async def clear_cache(self) -> None:
        """Clear all cached models."""
        self._cache.clear()
        for cache_file in self.cache_dir.glob("*.pkl"):
            cache_file.unlink(missing_ok=True)


# Global cache instance
model_cache = ModelCache()
