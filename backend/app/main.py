from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import prediction
from app.core.config import settings
from app.services import inference, preprocessing
from app.utils.logging_config import get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model and the allowed-locations list once at startup (not on every request)
    logger.info("Loading model from %s", settings.MODEL_PATH)
    inference.load_model(settings.MODEL_PATH)
    logger.info("Loading allowed locations from %s", settings.LOCATIONS_PATH)
    preprocessing.load_allowed_locations(settings.LOCATIONS_PATH)
    logger.info("Model and locations loaded successfully")
    yield
    logger.info("Shutting down")


app = FastAPI(
    title="House Price Prediction API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prediction.router)
