from sqlalchemy import Column, String, Integer
from app.database import Base
from app.models.base import TimestampMixin

class MediaFile(Base, TimestampMixin):
    __tablename__ = "media_files"
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="")
    alt_text = Column(String(255), default="")
