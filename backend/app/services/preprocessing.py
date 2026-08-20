import json
from pathlib import Path

import pandas as pd

from app.schemas.prediction import PredictionRequest

# Column order/names must exactly match numeric_features + categorical_features
# used when the Pipeline was fit in the training notebook.
NUMERIC_FEATURES = ["carpet_area_sqft", "floor_num", "bathroom", "balcony"]
CATEGORICAL_FEATURES = ["location_grouped", "Furnishing", "Transaction", "Ownership", "facing"]

_allowed_locations: set[str] | None = None


def load_allowed_locations(path: str) -> set[str]:
    """Load the list of locations kept during training (everything else -> 'other')."""
    global _allowed_locations
    p = Path(path)
    if not p.exists():
        _allowed_locations = set()
        return _allowed_locations
    with p.open() as f:
        _allowed_locations = set(json.load(f))
    return _allowed_locations


def _group_location(location: str) -> str:
    if _allowed_locations is None:
        # Locations list not loaded (shouldn't happen if lifespan ran) -> be conservative
        return "other"
    return location if location in _allowed_locations else "other"


def request_to_dataframe(req: PredictionRequest) -> pd.DataFrame:
    row = {
        "carpet_area_sqft": req.carpet_area_sqft,
        "floor_num": req.floor_num,
        "bathroom": req.bathroom,
        "balcony": req.balcony,
        "location_grouped": _group_location(req.location),
        "Furnishing": req.furnishing,
        "Transaction": req.transaction,
        "Ownership": req.ownership,
        "facing": req.facing,
    }
    return pd.DataFrame([row], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)
