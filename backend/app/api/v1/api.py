from fastapi import APIRouter
from app.api.v1.endpoints import health, finance

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(finance.router, prefix="/finance", tags=["Financial Structuring"])
