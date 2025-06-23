import asyncio
from typing import Dict, Any
from fastapi import HTTPException

from .cache import model_cache
from .adapters import ModelAdapterFactory, ModelAdapter
from .schemas import (
    InferenceInput,
    ModelPrediction,
    BayesianNetworkPrediction,
    GMMPrediction,
    IsapreEnum,
    TipoEnum,
    PredictionResponse,
    LogisticRegressionResponse,
    BayesianNetworkResponse,
    GMMResponse,
)


class InferenceService:
    """Service for machine learning inference operations."""

    MODEL_NAMES = {
        "logistic_regressor": "logistic_regressor",
        "discrete_bayesian_network": "discrete_bayesian_network",
        "gmm": "gmm",
    }

    def __init__(self):
        self._adapters: Dict[str, ModelAdapter] = {}

    async def _get_adapter(self, model_name: str) -> ModelAdapter:
        """Get or create model adapter."""
        if model_name not in self._adapters:
            if model_name not in self.MODEL_NAMES:
                raise HTTPException(
                    status_code=400, detail=f"Unknown model: {model_name}"
                )

            # Load model from cache
            model = await model_cache.get_model(self.MODEL_NAMES[model_name])

            # Create adapter
            adapter = ModelAdapterFactory.create_adapter(model_name, model)
            self._adapters[model_name] = adapter

        return self._adapters[model_name]

    async def predict_logistic_regression(
        self, input_data: InferenceInput
    ) -> ModelPrediction:
        """Make prediction using logistic regression model."""
        adapter = await self._get_adapter("logistic_regressor")
        return await adapter.predict(input_data)

    async def predict_bayesian_network(
        self, input_data: InferenceInput
    ) -> BayesianNetworkPrediction:
        """Make prediction using Bayesian network model."""
        adapter = await self._get_adapter("discrete_bayesian_network")
        return await adapter.predict(input_data)

    async def predict_gmm(self, input_data: InferenceInput) -> GMMPrediction:
        """Make prediction using GMM model."""
        adapter = await self._get_adapter("gmm")
        return await adapter.predict(input_data)

    async def predict_all_models(
        self, input_data: InferenceInput
    ) -> PredictionResponse:
        """Run prediction on all models and return formatted response."""
        # Run all predictions concurrently
        lr_result, bn_result, gmm_result = await asyncio.gather(
            self.predict_logistic_regression(input_data),
            self.predict_bayesian_network(input_data),
            self.predict_gmm(input_data),
        )

        # Format responses according to API specification
        return PredictionResponse(
            logistic_regression=LogisticRegressionResponse(
                probability=lr_result.probability,
                chosen_class=bool(lr_result.predicted_class),
            ),
            bayesian_network=BayesianNetworkResponse(
                probability=bn_result.probability,
                expected_reimbursement=int(bn_result.expected_amount),
                expected_wait=int(bn_result.expected_days),
            ),
            gmm=GMMResponse(probability=gmm_result.probability),
        )

    async def run_debug_inference(self) -> Dict[str, Any]:
        """Run debug inference with predefined test data."""
        # Test data including new enum values with Spanish characters
        test_inputs = [
            InferenceInput(
                isapre=IsapreEnum.FONASA, tipo=TipoEnum.HORA_MEDICA, total=100_000
            ),
            InferenceInput(
                isapre=IsapreEnum.CRUZ_BLANCA,
                tipo=TipoEnum.EXAMENES_IMAGENES,
                total=58_000,
            ),
            InferenceInput(
                isapre=IsapreEnum.BANMEDICA, tipo=TipoEnum.FONOAUDIOLOGIA, total=60_000
            ),
        ]

        results = {}

        try:
            # Logistic Regression
            lr_result = await self.predict_logistic_regression(test_inputs[0])
            results["logistic_regression"] = {
                "input": test_inputs[0].model_dump(),
                "probability": lr_result.probability,
                "predicted_class": lr_result.predicted_class,
                "interpretation": "1 = habrá reembolso, 0 = no habrá",
            }

            # Bayesian Network
            bn_result = await self.predict_bayesian_network(test_inputs[1])
            results["bayesian_network"] = {
                "input": test_inputs[1].model_dump(),
                "probability": bn_result.probability,
                "expected_amount_clp": bn_result.expected_amount,
                "expected_days": bn_result.expected_days,
            }

            # GMM
            gmm_result = await self.predict_gmm(test_inputs[2])
            results["gmm"] = {
                "input": test_inputs[2].model_dump(),
                "probability": gmm_result.probability,
            }

        except Exception as e:
            results["error"] = str(e)

        return results

    async def clear_model_cache(self) -> None:
        """Clear all cached models."""
        self._adapters.clear()
        await model_cache.clear_cache()


# Global service instance
inference_service = InferenceService()
