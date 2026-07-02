from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.database.connection import Base


class SubTopic(Base):
    __tablename__ = "subtopics"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)

    topic_id = Column(
        Integer,
        ForeignKey("topics.id")
    )