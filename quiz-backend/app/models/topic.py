from sqlalchemy import Column, Integer, String
from pydantic import BaseModel

from app.database.connection import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

class TopicCreate(BaseModel):
    name: str

class TopicResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True



