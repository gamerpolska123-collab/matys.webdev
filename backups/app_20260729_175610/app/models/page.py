from sqlalchemy import Column, String, Boolean, Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class Page(Base, TimestampMixin):
    __tablename__ = "pages"
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    meta_description = Column(String(500), default="")
    is_published = Column(Boolean, default=False)
    is_homepage = Column(Boolean, default=False)
    template = Column(String(100), default="default")
    module = Column(String(50), default="onepage")
    sort_order = Column(Integer, default=0)
    sections = relationship("PageSection", back_populates="page", cascade="all, delete-orphan", order_by="PageSection.sort_order")

class PageSection(Base, TimestampMixin):
    __tablename__ = "page_sections"
    page_id = Column(Integer, ForeignKey("pages.id"), nullable=False)
    title = Column(String(255), default="")
    section_type = Column(String(50), default="text")
    content = Column(Text, default="")
    content_json = Column(JSON, default=dict)
    sort_order = Column(Integer, default=0)
    is_visible = Column(Boolean, default=True)
    background_image = Column(String(500), default="")
    page = relationship("Page", back_populates="sections")
