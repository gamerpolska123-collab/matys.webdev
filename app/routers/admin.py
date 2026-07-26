from fastapi import APIRouter, Depends, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Page, PageSection, SiteSettings, MediaFile
from app.core.security import decode_token
from app.core.module_manager import module_manager

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

def get_admin_user(request: Request, db: Session = Depends(get_db)):
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

# === DASHBOARD ===
@router.get("/admin", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    stats = {
        "pages": db.query(func.count(Page.id)).scalar(),
        "sections": db.query(func.count(PageSection.id)).scalar(),
        "media": db.query(func.count(MediaFile.id)).scalar(),
        "published": db.query(func.count(Page.id)).filter(Page.is_published == True).scalar()
    }
    recent_pages = db.query(Page).order_by(Page.updated_at.desc()).limit(5).all()
    return templates.TemplateResponse("admin/dashboard.html", {
        "request": request, "user": user, "stats": stats, 
        "recent_pages": recent_pages, "menu": module_manager.get_admin_menu()
    })

# === PAGES CRUD ===
@router.get("/admin/pages", response_class=HTMLResponse)
async def admin_pages(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    pages = db.query(Page).order_by(Page.sort_order).all()
    return templates.TemplateResponse("admin/pages/list.html", {
        "request": request, "user": user, "pages": pages, "menu": module_manager.get_admin_menu()
    })

@router.get("/admin/pages/new", response_class=HTMLResponse)
async def admin_page_new(request: Request, user: User = Depends(get_admin_user)):
    return templates.TemplateResponse("admin/pages/edit.html", {
        "request": request, "user": user, "page": None, "menu": module_manager.get_admin_menu()
    })

@router.get("/admin/pages/{page_id}/edit", response_class=HTMLResponse)
async def admin_page_edit(request: Request, page_id: int, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        return RedirectResponse("/admin/pages", status_code=302)
    return templates.TemplateResponse("admin/pages/edit.html", {
        "request": request, "user": user, "page": page, "menu": module_manager.get_admin_menu()
    })

# === SECTIONS ===
@router.get("/admin/pages/{page_id}/sections", response_class=HTMLResponse)
async def admin_sections(request: Request, page_id: int, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        return RedirectResponse("/admin/pages", status_code=302)
    sections = db.query(PageSection).filter(PageSection.page_id == page_id).order_by(PageSection.sort_order).all()
    return templates.TemplateResponse("admin/pages/sections.html", {
        "request": request, "user": user, "page": page, "sections": sections,
        "menu": module_manager.get_admin_menu()
    })

# === SETTINGS ===
@router.get("/admin/settings", response_class=HTMLResponse)
async def admin_settings(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return templates.TemplateResponse("admin/settings.html", {
        "request": request, "user": user, "settings": settings, "menu": module_manager.get_admin_menu()
    })

# === MEDIA ===
@router.get("/admin/media", response_class=HTMLResponse)
async def admin_media(request: Request, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    files = db.query(MediaFile).order_by(MediaFile.created_at.desc()).all()
    return templates.TemplateResponse("admin/media.html", {
        "request": request, "user": user, "files": files, "menu": module_manager.get_admin_menu()
    })
