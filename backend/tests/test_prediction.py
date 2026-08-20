import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    # Using a context manager ensures the FastAPI lifespan (which loads the
    # model) actually runs before the tests fire requests at the app.
    with TestClient(app) as c:
        yield c


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_happy_path(client):
    payload = {
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
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert isinstance(body["predicted_price"], float)
    assert body["predicted_price"] > 0


def test_predict_invalid_input_returns_422(client):
    # Missing required fields + wrong type for carpet_area_sqft
    payload = {
        "carpet_area_sqft": "not-a-number",
        "floor_num": 3,
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
