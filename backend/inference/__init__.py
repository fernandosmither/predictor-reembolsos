"""
Inference module for machine learning model predictions.

This module provides:
- Model caching with R2 backend
- Standardized model adapters
- Async inference service
- FastAPI dependencies
"""

from .service import inference_service
from .schemas import (
    InferenceInput,
    ModelPrediction,
    BayesianNetworkPrediction,
    GMMPrediction,
    PredictionResponse,
    LogisticRegressionResponse,
    BayesianNetworkResponse,
    GMMResponse,
    IsapreEnum,
    TipoEnum,
)
from .dependencies import InferenceServiceDep, R2ClientDep

__all__ = [
    "inference_service",
    "InferenceInput",
    "ModelPrediction",
    "BayesianNetworkPrediction",
    "GMMPrediction",
    "PredictionResponse",
    "LogisticRegressionResponse",
    "BayesianNetworkResponse",
    "GMMResponse",
    "IsapreEnum",
    "TipoEnum",
    "InferenceServiceDep",
    "R2ClientDep",
]
