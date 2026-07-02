from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime
from app.database.connection import Base
from sqlalchemy import func

class QuizAttempt(Base):

    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True)

    session_id = Column(
        Integer, ForeignKey("quiz_sessions.id")
    )

    question_id = Column(
        Integer, ForeignKey("questions.id")
)

    options_id = Column(
        Integer, ForeignKey("options.id")
    )

    is_correct = Column(Boolean)

    created_at = Column(DateTime(timezone=True),
                        server_default=func.now())
    