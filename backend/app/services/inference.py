import numpy as np
import joblib
import pandas as pd

_model = None


def load_model(path: str):
    """Load the pickled sklearn Pipeline once at startup."""
    global _model
    _model = joblib.load(path)
    return _model


def get_model():
    if _model is None:
        raise RuntimeError("Model has not been loaded yet. Call load_model() at startup.")
    return _model


def predict_price(row: pd.DataFrame) -> float:
    """Run the pipeline and invert the log1p transform used during training.

    IMPORTANT: the notebook trains on np.log1p(price), so predictions must be
    passed through np.expm1() to get back to real rupee values.
    """
    model = get_model()
    log_pred = model.predict(row)
    price = np.expm1(log_pred)
    return float(price[0])
