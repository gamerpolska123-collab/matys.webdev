from fastapi import APIRouter, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Page, PageSection, SiteSettings

router = APIRouter()
templates = Jinja2Templates(directory="modules/onepage/templates")

# Menu dla admin panelu
admin_menu = [
    {"title": "OnePage", "icon": "layout", "url": "/mod/onepage/", "position": 10}
]

@router.get("/", response_class=HTMLResponse)
async def onepage_home(request: Request, db: Session = Depends(get_db)):
    site = db.query(SiteSettings).first()
    page = db.query(Page).filter(Page.is_homepage == True, Page.module == "onepage").first()
    if not page:
        page = db.query(Page).filter(Page.module == "onepage", Page.is_published == True).first()

    sections = []
    if page:
        sections = db.query(PageSection).filter(
            PageSection.page_id == page.id,
            PageSection.is_visible == True
        ).order_by(PageSection.sort_order).all()

    return templates.TemplateResponse("index.html", {
        "request": request,
        "site": site,
        "page": page,
        "sections": sections
    })
