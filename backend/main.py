from typing import Dict, Any
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from inference.dependencies import InferenceServiceDep
from inference.schemas import InferenceInput, PredictionResponse

app = FastAPI(
    title="Predictor de Reembolsos",
    description="API para predicción de reembolsos de seguros de salud usando múltiples modelos de ML",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://reembolsos.fdosmith.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/debug")
async def debug(inference_service: InferenceServiceDep) -> Dict[str, Any]:
    """Debug endpoint that runs inference tests with all models."""
    print("=== Debug endpoint called ===")

    results = await inference_service.run_debug_inference()

    # Print results to console (as requested)
    print("\n=== LOGISTIC REGRESSION ===")
    if "logistic_regression" in results:
        lr = results["logistic_regression"]
        print(f"Input: {lr['input']}")
        print(f"P(reembolso)  = {lr['probability']:.3f}")
        print(f"Class chosen  = {lr['predicted_class']}  ({lr['interpretation']})")

    print("\n=== BAYESIAN NETWORK ===")
    if "bayesian_network" in results:
        bn = results["bayesian_network"]
        print(f"Input: {bn['input']}")
        print(f"Probabilidad de reembolso  : {bn['probability']:.2%}")
        print(f"Monto esperado (CLP)       : ${bn['expected_amount_clp']:,.0f}")
        print(f"Días para aprobación (mean): {bn['expected_days']:.1f}")

    print("\n=== GMM MODEL ===")
    if "gmm" in results:
        gmm = results["gmm"]
        print(f"Input: {gmm['input']}")
        print(f"Model P(approved) = {gmm['probability']:.3%}")

    if "error" in results:
        print(f"\n=== ERROR ===")
        print(f"Error: {results['error']}")

        print("=== Debug endpoint completed ===\n")

    return results


@app.post("/predict", response_model=PredictionResponse)
async def predict(
    input_data: InferenceInput, inference_service: InferenceServiceDep
) -> PredictionResponse:
    """
    Predict reimbursement outcomes using all available models.

    Runs the input through:
    - Logistic Regression model
    - Bayesian Network model
    - Gaussian Mixture Model (GMM)

    Returns predictions from all models with probabilities and expected outcomes.
    """
    print(f"=== Prediction request received ===")
    print(f"Input - Isapre: {input_data.isapre.value}")
    print(f"Input - Tipo: {input_data.tipo.value}")
    print(f"Input - Total: ${input_data.total:,} CLP")

    try:
        # Run all models concurrently
        result = await inference_service.predict_all_models(input_data)

        print(f"=== Prediction completed successfully ===")
        print(
            f"Logistic Regression - Probability: {result.logistic_regression.probability:.3f}, Class: {result.logistic_regression.chosen_class}"
        )
        print(
            f"Bayesian Network - Probability: {result.bayesian_network.probability:.3f}, Amount: ${result.bayesian_network.expected_reimbursement:,}, Days: {result.bayesian_network.expected_wait}"
        )
        print(f"GMM - Probability: {result.gmm.probability:.3f}")

        return result

    except Exception as e:
        print(f"=== Prediction failed ===")
        print(f"Error: {str(e)}")
        raise
