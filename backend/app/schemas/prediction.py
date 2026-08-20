from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    # Numeric features (must match numeric_features used in training)
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., description="Floor number (0 = ground, -1 = basement)")
    bathroom: int = Field(..., ge=0)
    balcony: int = Field(..., ge=0)

    # Categorical features (must match categorical_features used in training)
    location: str = Field(..., description="Raw location string; grouped server-side")
    furnishing: str = Field(..., description='"Furnished" | "Semi-Furnished" | "Unfurnished"')
    transaction: str = Field(..., description='"New Property" | "Resale"')
    ownership: str
    facing: str

    model_config = {
        "json_schema_extra": {
            "example": {
                "carpet_area_sqft": 1200,
                "floor_num": 3,
                "bathroom": 2,
                "balcony": 1,
                "location": "Mumbai",
                "furnishing": "Semi-Furnished",
                "transaction": "Resale",
                "ownership": "Freehold",
                "facing": "East",
            }
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float


class HealthResponse(BaseModel):
    status: str
