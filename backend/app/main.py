from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "SAARTHI: AI-Driven Hyper-Local Business Advisory and Financial Structuring "
        "Assistant for Rural Micro-Entrepreneurs (SIH26091 - MoSJE)."
    ),
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Enable CORS for Next.js frontend and Cloudflare Worker clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to SAARTHI AI API (SIH26091)",
        "tagline": "Evidence Before Enterprise",
        "docs": f"{settings.API_V1_STR}/docs",
        "status": "online"
    }

@app.get("/health")
def root_health():
    return {"status": "ok", "service": settings.PROJECT_NAME}
