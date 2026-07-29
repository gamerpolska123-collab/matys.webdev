from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///data/cms.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    ADMIN_EMAIL: str = "admin@firma.pl"
    ADMIN_PASSWORD: str = "admin123"
    MODULES_ENABLED: str = "onepage"
    UPLOAD_DIR: str = "/app/uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024

    @property
    def enabled_modules_list(self):
        return [m.strip() for m in self.MODULES_ENABLED.split(",") if m.strip()]

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
