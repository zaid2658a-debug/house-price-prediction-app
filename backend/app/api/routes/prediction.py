from fastapi import APIRouter

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services import inference, preprocessing

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")


@router.post("/predict", response_model=PredictionResponse)
async def predict(req: PredictionRequest):
    row = preprocessing.request_to_dataframe(req)
    price = inference.predict_price(row)
    return PredictionResponse(predicted_price=price)
