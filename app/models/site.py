from sqlalchemy import Column, String, Text, JSON, Integer
from app.database import Base

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True)
    site_name = Column(String(255), default="Firma Budowlana")
    site_tagline = Column(String(500), default="Profesjonalne usługi budowlane")
    logo_url = Column(String(500), default="")
    favicon_url = Column(String(500), default="")
    contact_email = Column(String(255), default="")
    contact_phone = Column(String(50), default="")
    contact_address = Column(Text, default="")
    social_links = Column(JSON, default=dict)
    analytics_code = Column(Text, default="")
    custom_css = Column(Text, default="")
    seo_keywords = Column(String(500), default="")
