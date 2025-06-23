import numpy as np
import pandas as pd
from abc import ABC, abstractmethod
from typing import Any

from .schemas import (
    InferenceInput,
    ModelPrediction,
    BayesianNetworkPrediction,
    GMMPrediction,
)


class ModelAdapter(ABC):
    """Abstract base class for model adapters."""

    def __init__(self, model: Any):
        self.model = model

    @abstractmethod
    async def predict(self, input_data: InferenceInput) -> Any:
        """Make a prediction using the model."""
        pass

    def _prepare_dataframe(self, input_data: InferenceInput) -> pd.DataFrame:
        """Convert input data to DataFrame format."""
        return pd.DataFrame(
            [
                {
                    "isapre": input_data.isapre.value,
                    "tipo": input_data.tipo.value,
                    "total": input_data.total,
                }
            ]
        )


class LogisticRegressorAdapter(ModelAdapter):
    """Adapter for logistic regression models."""

    async def predict(self, input_data: InferenceInput) -> ModelPrediction:
        df = self._prepare_dataframe(input_data)

        # Get probability and prediction
        probability = float(self.model.predict_proba(df)[0, 1])
        predicted_class = int(self.model.predict(df)[0])

        return ModelPrediction(probability=probability, predicted_class=predicted_class)


class BayesianNetworkAdapter(ModelAdapter):
    """Adapter for Bayesian Network models."""

    async def predict(self, input_data: InferenceInput) -> BayesianNetworkPrediction:
        # Bayesian networks have a different interface
        probability, expected_amount, expected_days = self.model.predict_all(
            input_data.isapre.value, input_data.tipo.value, input_data.total
        )

        return BayesianNetworkPrediction(
            probability=float(probability),
            expected_amount=float(expected_amount),
            expected_days=float(expected_days),
        )


class GMMAdapter(ModelAdapter):
    """Adapter for Gaussian Mixture Model."""

    async def predict(self, input_data: InferenceInput) -> GMMPrediction:
        # Prepare data with log transformation
        gmm_input = {
            "isapre": input_data.isapre.value,
            "tipo": input_data.tipo.value,
            "total": input_data.total,
            "total_log": np.log1p(input_data.total),
        }

        row = pd.Series(gmm_input)
        probability = float(self.model(row))

        return GMMPrediction(probability=probability)


class ModelAdapterFactory:
    """Factory to create appropriate model adapters."""

    @staticmethod
    def create_adapter(model_name: str, model: Any) -> ModelAdapter:
        """Create the appropriate adapter for the given model."""
        if model_name == "logistic_regressor":
            return LogisticRegressorAdapter(model)
        elif model_name == "discrete_bayesian_network":
            return BayesianNetworkAdapter(model)
        elif model_name == "gmm":
            return GMMAdapter(model)
        else:
            raise ValueError(f"Unknown model type: {model_name}")
