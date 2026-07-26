import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from contextlib import asynccontextmanager

from app.database import engine, Base, SessionLocal
from app.models import User, SiteSettings
from app.core.security import get_password_hash
from app.core.module_manager import module_manager
from app.config import get_settings
from app.routers import auth, api, admin

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[STARTUP] Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("[STARTUP] Checking admin user...")
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            print(f"[STARTUP] Creating admin: {settings.ADMIN_EMAIL}")
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Administrator",
                is_active=True,
                is_superuser=True
            )
            db.add(admin_user)

        print("[STARTUP] Checking site settings...")
        site = db.query(SiteSettings).first()
        if not site:
            print("[STARTUP] Creating default site settings...")
            site = SiteSettings(
                site_name="Firma Budowlana MAX",
                site_tagline="Budujemy z pasją od 1998 roku",
                contact_email="kontakt@firma-budowlana.pl",
                contact_phone="+48 123 456 789",
                contact_address="ul. Budowlana 1\n00-001 Warszawa"
            )
            db.add(site)

        db.commit()
        print("[STARTUP] Database ready.")
    except Exception as e:
        print(f"[STARTUP ERROR] {e}")
        raise
    finally:
        db.close()

    print("[STARTUP] Discovering modules...")
    module_manager.discover_modules()
    module_manager.register_routers(app)
    print(f"[STARTUP] Loaded modules: {list(module_manager.modules.keys())}")

    yield
    print("[SHUTDOWN] Cleaning up...")

app = FastAPI(
    title="Construction CMS",
    description="Profesjonalny CMS dla firm budowlanych",
    version="1.0.0",
    lifespan=lifespan
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth.router)
app.include_router(api.router)
app.include_router(admin.router)

@app.get("/", response_class=HTMLResponse)
async def homepage(request: Request):
    return RedirectResponse(url="/mod/onepage/")

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
