from enum import Enum
from pydantic import BaseModel, Field


class IsapreEnum(str, Enum):
    BANMEDICA = "Banmédica"
    COLMENA = "Colmena"
    CONSALUD = "Consalud"
    CRUZ_BLANCA = "Cruz Blanca"
    ESENCIAL = "Esencial"
    FONASA = "FONASA"
    ISAPRE_FUNDACION_BANCOESTADO = "Isapre Fundación BancoEstado"
    MASVIDA = "Masvida"
    VIDA_TRES = "Vida Tres"


class TipoEnum(str, Enum):
    DENTAL = "Dental"
    EXAMENES_IMAGENES = "Examen / Imágenes"
    FONOAUDIOLOGIA = "Fonoaudiología"
    HORA_MEDICA = "Hora Médica"
    KINESIOLOGIA = "Kinesiología"
    MEDICAMENTOS = "Medicamentos"
    OTRO = "Otro"
    PROCEDIMIENTO_AMBULATORIO = "Proced. Ambulatorio"
    PROCEDIMIENTO_HOSPITALIZACION = "Proced. Hospitalización"
    PSICOLOGIA = "Psicología"
    TERAPIA_OCUPACIONAL = "Terapia Ocupacional"
    URGENCIA = "Urgencia"


class InferenceInput(BaseModel):
    isapre: IsapreEnum
    tipo: TipoEnum
    total: int = Field(gt=0, description="Total amount in CLP")


class ModelPrediction(BaseModel):
    probability: float = Field(ge=0, le=1, description="Probability of reimbursement")
    predicted_class: int = Field(
        description="Predicted class (1 = approved, 0 = denied)"
    )


class BayesianNetworkPrediction(BaseModel):
    probability: float = Field(ge=0, le=1, description="Probability of reimbursement")
    expected_amount: float = Field(description="Expected reimbursement amount in CLP")
    expected_days: float = Field(description="Expected days for approval")


class GMMPrediction(BaseModel):
    probability: float = Field(
        ge=0, le=1, description="Probability of approval from GMM model"
    )


# API Response schemas
class LogisticRegressionResponse(BaseModel):
    probability: float = Field(ge=0, le=1, description="Probability of reimbursement")
    chosen_class: bool = Field(
        description="Predicted class (True = approved, False = denied)"
    )


class BayesianNetworkResponse(BaseModel):
    probability: float = Field(ge=0, le=1, description="Probability of reimbursement")
    expected_reimbursement: int = Field(
        description="Expected reimbursement amount in CLP"
    )
    expected_wait: int = Field(description="Expected days for approval")


class GMMResponse(BaseModel):
    probability: float = Field(ge=0, le=1, description="Probability of approval")


class PredictionResponse(BaseModel):
    logistic_regression: LogisticRegressionResponse
    bayesian_network: BayesianNetworkResponse
    gmm: GMMResponse
