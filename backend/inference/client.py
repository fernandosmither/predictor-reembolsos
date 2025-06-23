import pickle
import pandas as pd
import numpy as np


class InferenceClient:
    def __init__(self, model_path: str):
        self.model = pickle.load(open(model_path, "rb"))

    def predict(self, data: dict) -> dict:
        return self.model.predict(data)

    def predict_proba(self, data: dict) -> dict:
        return self.model.predict_proba(data)


probe = pd.DataFrame(
    [
        {
            "isapre": "FONASA",  # <- string, exactly as it appears in X_train
            "tipo": "Hora Médica",  # <- another category
            "total": 100_000,  # <- integer CLP
        }
    ]
)


if __name__ == "__main__":
    client = InferenceClient("logistic_regressor.pkl")
    print(f"P(reembolso)  = {client.predict_proba(probe)[0,1]:.3f}")
    print(f"Class chosen  = {client.predict(probe)[0]}  (1 = habrá, 0 = no)")

    client = InferenceClient("discrete_bayesian_network.pkl")
    reembolso_bn = pickle.load(open("discrete_bayesian_network.pkl", "rb"))

    p, monto, dias = reembolso_bn.predict_all(
        "Cruz Blanca", "Examen / Imágenes", 58_000
    )

    print(f"Probabilidad de reembolso  : {p:.2%}")
    print(f"Monto esperado (CLP)       : ${monto:,.0f}")
    print(f"Días para aprobación (mean): {dias:.1f}")

    gmm_input = {
        "isapre": "FONASA",
        "tipo": "Medicamentos",
        "total": 60_000,
    }
    gmm_input["total_log"] = np.log1p(gmm_input["total"])
    row = pd.Series(gmm_input)

    row_proba = pickle.load(open("gmm.pkl", "rb"))
    p = row_proba(row)
    print(f"Model P(approved) = {p:.3%}")
