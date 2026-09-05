from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SAARTHI AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DATABASE_URL: Optional[str] = None
    
    # Financial Model Thresholds (SIH26091 Norms)
    EQUITY_MARGIN_RATIO: float = 0.10  # 10% own equity
    LOAN_RATIO: float = 0.90           # 90% loan
    
    MICROFINANCE_MAX_COST: float = 140000.0  # ₹1.40 Lakh
    MICROFINANCE_INTEREST_RATE: float = 6.5  # 6.5% p.a.
    MICROFINANCE_TENURE_YEARS: int = 3       # 3 Years (36 Months)
    MICROFINANCE_MORATORIUM_MONTHS: int = 3  # 3 Months
    
    TERM_LOAN_MAX_COST: float = 5000000.0    # ₹50.00 Lakh
    TERM_LOAN_INTEREST_RATE: float = 8.0     # 8.0% p.a.
    TERM_LOAN_TENURE_YEARS: int = 7          # 7 Years (84 Months)
    TERM_LOAN_MORATORIUM_MONTHS: int = 6     # 6 Months

    model_config = {"case_sensitive": True, "env_file": ".env", "extra": "allow"}

settings = Settings()
