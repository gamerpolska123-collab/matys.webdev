from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import Page, PageSection, SiteSettings, MediaFile, User
from app.core.security import decode_token
from app.config import get_settings
import os, shutil, uuid

router = APIRouter(prefix="/api", tags=["api"])
settings = get_settings()

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# === SITE SETTINGS ===
class SiteSettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    site_tagline: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_address: Optional[str] = None
    seo_keywords: Optional[str] = None
    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None

@router.get("/settings")
async def get_settings_api(db: Session = Depends(get_db)):
    s = db.query(SiteSettings).first()
    if not s:
        s = SiteSettings(); db.add(s); db.commit(); db.refresh(s)
    return s

@router.put("/settings")
async def update_settings(data: SiteSettingsUpdate, db: Session = Depends(get_db)):
    s = db.query(SiteSettings).first()
    if not s:
        s = SiteSettings(); db.add(s)
    for field, value in data.dict(exclude_unset=True).items():
        setattr(s, field, value)
    db.commit(); db.refresh(s)
    return s

# === HOMEPAGE SECTIONS ===
class SectionCreate(BaseModel):
    title: Optional[str] = ""
    section_type: str = "text"
    content: Optional[str] = ""
    content_json: Optional[dict] = None
    sort_order: Optional[int] = 0
    is_visible: Optional[bool] = True
    background_image: Optional[str] = ""

@router.get("/homepage/sections")
async def list_homepage_sections(db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.is_homepage == True).first()
    if not page:
        return []
    return db.query(PageSection).filter(PageSection.page_id == page.id).order_by(PageSection.sort_order).all()

@router.post("/homepage/sections")
async def create_homepage_section(data: SectionCreate, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.is_homepage == True).first()
    if not page:
        page = Page(title="Strona główna", slug="", is_homepage=True, is_published=True, module="onepage")
        db.add(page); db.commit(); db.refresh(page)
    section = PageSection(page_id=page.id, **data.dict())
    db.add(section); db.commit(); db.refresh(section)
    return section

@router.put("/homepage/sections/{section_id}")
async def update_homepage_section(section_id: int, data: SectionCreate, db: Session = Depends(get_db)):
    section = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not section: raise HTTPException(status_code=404, detail="Section not found")
    for field, value in data.dict(exclude_unset=True).items(): setattr(section, field, value)
    db.commit(); db.refresh(section)
    return section

@router.delete("/homepage/sections/{section_id}")
async def delete_homepage_section(section_id: int, db: Session = Depends(get_db)):
    section = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not section: raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section); db.commit()
    return {"ok": True}

@router.post("/homepage/sections/{section_id}/sort")
async def sort_section(section_id: int, direction: str, db: Session = Depends(get_db)):
    """direction: 'up' lub 'down'"""
    section = db.query(PageSection).filter(PageSection.id == section_id).first()
    if not section: raise HTTPException(status_code=404, detail="Section not found")

    if direction == "up":
        other = db.query(PageSection).filter(
            PageSection.page_id == section.page_id,
            PageSection.sort_order < section.sort_order
        ).order_by(PageSection.sort_order.desc()).first()
    else:
        other = db.query(PageSection).filter(
            PageSection.page_id == section.page_id,
            PageSection.sort_order > section.sort_order
        ).order_by(PageSection.sort_order.asc()).first()

    if other:
        section.sort_order, other.sort_order = other.sort_order, section.sort_order
        db.commit()
    return {"ok": True}

@router.post("/homepage/toggle-publish")
async def toggle_publish(db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.is_homepage == True).first()
    if not page: raise HTTPException(status_code=404, detail="Homepage not found")
    page.is_published = not page.is_published
    db.commit(); db.refresh(page)
    return {"published": page.is_published}

# === MEDIA ===
@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = file.filename.split(".")[-1] if "." in file.filename else ""
    new_filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, new_filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    media = MediaFile(
        filename=new_filename, original_name=file.filename,
        file_path=f"/uploads/{new_filename}", file_size=os.path.getsize(file_path),
        mime_type=file.content_type or ""
    )
    db.add(media); db.commit(); db.refresh(media)
    return media

@router.get("/media")
async def list_media(db: Session = Depends(get_db)):
    return db.query(MediaFile).order_by(MediaFile.created_at.desc()).all()

@router.delete("/media/{media_id}")
async def delete_media(media_id: int, db: Session = Depends(get_db)):
    media = db.query(MediaFile).filter(MediaFile.id == media_id).first()
    if not media: raise HTTPException(status_code=404, detail="File not found")
    try:
        full_path = os.path.join(settings.UPLOAD_DIR, media.filename)
        if os.path.exists(full_path): os.remove(full_path)
    except: pass
    db.delete(media); db.commit()
    return {"ok": True}
