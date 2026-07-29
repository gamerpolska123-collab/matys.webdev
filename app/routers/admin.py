from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Page, PageSection, SiteSettings, MediaFile
from app.core.security import decode_token
from app.core.module_manager import module_manager
from app.config import get_settings

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")
settings = get_settings()

def get_admin_user(request: Request, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user

from fastapi import HTTPException

# === DASHBOARD ===
@router.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.is_homepage == True).first()
    stats = {
        "sections": db.query(func.count(PageSection.id)).scalar() if page else 0,
        "visible": db.query(func.count(PageSection.id)).filter(PageSection.is_visible == True).scalar() if page else 0,
        "media": db.query(func.count(MediaFile.id)).scalar(),
        "published": page.is_published if page else False
    }
    return templates.TemplateResponse("admin/dashboard.html", {
        "request": request, "user": user, "stats": stats,
        "menu": module_manager.get_admin_menu()
    })

# === PAGE BUILDER (NOWOŚĆ v1.1) ===
@router.get("/admin/builder", response_class=HTMLResponse)
async def admin_builder(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.is_homepage == True).first()
    if not page:
        page = Page(title="Strona główna", slug="", is_homepage=True, is_published=True, module="onepage")
        db.add(page); db.commit(); db.refresh(page)
    sections = db.query(PageSection).filter(PageSection.page_id == page.id).order_by(PageSection.sort_order).all()
    return templates.TemplateResponse("admin/builder/index.html", {
        "request": request, "user": user, "page": page, "sections": sections,
        "menu": module_manager.get_admin_menu()
    })

# === SEKCJE STRONY GŁÓWNEJ (stary endpoint, zachowany dla kompatybilności) ===
@router.get("/admin/sections", response_class=HTMLResponse)
async def admin_sections(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.is_homepage == True).first()
    if not page:
        page = Page(title="Strona główna", slug="", is_homepage=True, is_published=True, module="onepage")
        db.add(page); db.commit(); db.refresh(page)
    sections = db.query(PageSection).filter(PageSection.page_id == page.id).order_by(PageSection.sort_order).all()
    return templates.TemplateResponse("admin/sections.html", {
        "request": request, "user": user, "page": page, "sections": sections,
        "menu": module_manager.get_admin_menu()
    })

# === LISTA STRON ===
@router.get("/admin/pages", response_class=HTMLResponse)
async def admin_pages_list(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    pages = db.query(Page).order_by(Page.sort_order, Page.created_at.desc()).all()
    return templates.TemplateResponse("admin/pages/list.html", {
        "request": request, "user": user, "pages": pages,
        "menu": module_manager.get_admin_menu()
    })

# === EDYCJA STRONY ===
@router.get("/admin/pages/{page_id}/edit", response_class=HTMLResponse)
async def admin_page_edit(request: Request, page_id: int, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        return RedirectResponse(url="/admin/pages", status_code=302)
    return templates.TemplateResponse("admin/pages/edit.html", {
        "request": request, "user": user, "page": page,
        "menu": module_manager.get_admin_menu()
    })

# === NOWA STRONA ===
@router.get("/admin/pages/new", response_class=HTMLResponse)
async def admin_page_new(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    return templates.TemplateResponse("admin/pages/edit.html", {
        "request": request, "user": user, "page": None,
        "menu": module_manager.get_admin_menu()
    })

# === SEKCJE KONKRETNEJ STRONY ===
@router.get("/admin/pages/{page_id}/sections", response_class=HTMLResponse)
async def admin_page_sections(request: Request, page_id: int, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        return RedirectResponse(url="/admin/pages", status_code=302)
    sections = db.query(PageSection).filter(PageSection.page_id == page.id).order_by(PageSection.sort_order).all()
    return templates.TemplateResponse("admin/pages/sections.html", {
        "request": request, "user": user, "page": page, "sections": sections,
        "menu": module_manager.get_admin_menu()
    })

# === USTAWIENIA FIRMY ===
@router.get("/admin/settings", response_class=HTMLResponse)
async def admin_settings(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    site = db.query(SiteSettings).first()
    if not site:
        site = SiteSettings(); db.add(site); db.commit(); db.refresh(site)
    return templates.TemplateResponse("admin/settings.html", {
        "request": request, "user": user, "settings": site, "menu": module_manager.get_admin_menu()
    })

# === MEDIA ===
@router.get("/admin/media", response_class=HTMLResponse)
async def admin_media(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    files = db.query(MediaFile).order_by(MediaFile.created_at.desc()).all()
    return templates.TemplateResponse("admin/media.html", {
        "request": request, "user": user, "files": files, "menu": module_manager.get_admin_menu()
    })
