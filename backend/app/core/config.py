from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MODEL_PATH: str = "models/house_price.pkl"
    LOCATIONS_PATH: str = "models/locations.json"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
