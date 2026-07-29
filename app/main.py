import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.exceptions import HTTPException
from contextlib import asynccontextmanager

from app.database import engine, Base, SessionLocal
from app.models import User, SiteSettings
from app.core.security import get_password_hash
from app.core.module_manager import module_manager
from app.config import get_settings
from app.routers import auth, api, admin
from app.__version__ import __version__, __build_date__

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[STARTUP v{__version__}] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin_user:
            print(f"[STARTUP] Creating admin: {settings.ADMIN_EMAIL}")
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Administrator", is_active=True, is_superuser=True
            )
            db.add(admin_user)
        site = db.query(SiteSettings).first()
        if not site:
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

    module_manager.discover_modules()
    module_manager.register_routers(app)
    print(f"[STARTUP] Loaded modules: {list(module_manager.modules.keys())}")
    yield
    print("[SHUTDOWN] Cleaning up...")

app = FastAPI(title="Construction CMS", version=__version__, lifespan=lifespan)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 401 and request.url.path.startswith("/admin"):
        return RedirectResponse(url="/login", status_code=302)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(api.router)
app.include_router(admin.router)

@app.get("/", response_class=HTMLResponse)
async def homepage(request: Request):
    return RedirectResponse(url="/mod/onepage/")

@app.get("/health")
async def health():
    return {"status": "ok", "version": __version__, "build": __build_date__}

@app.get("/api/version")
async def version():
    return {"version": __version__, "build": __build_date__}
