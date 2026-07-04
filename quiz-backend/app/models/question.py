from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True)

    question_text = Column(String, nullable=False)

    difficulty = Column(String, nullable=False)


    topic_id = Column(
        Integer,
        ForeignKey("topics.id")
    )

    subtopic_id = Column(
        Integer,
        ForeignKey("subtopics.id")
    )

    options = relationship(
                "Option",
                back_populates= "question",
                cascade="all, delete-orphan"
            )