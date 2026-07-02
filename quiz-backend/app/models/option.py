from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True)

    option_text = Column(String, nullable=False)

    is_correct = Column(Boolean, default=False)

    question_id = Column(
        Integer,
        ForeignKey("questions.id")
    )
    question = relationship(
            "Question",
            back_populates="options"
    )   

    