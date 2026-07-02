from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Float

from sqlalchemy.sql import func

from app.database.connection import Base

class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(Integer, primary_key=True)

    topic_id = Column(Integer, ForeignKey("topics.id"))

    user_id = Column(Integer, ForeignKey("users.id"))

    total_questions = Column(Integer, nullable=False)

    correct_answers = Column(Integer, nullable=False, default=0)

    wrong_answers = Column(Integer, nullable=False, default=0)
    
    score = Column(Integer, nullable=False, default=0)

    percentage = Column(Float, nullable=False, default=0)

    is_completed = Column(Boolean, nullable=False, default=False)

    started_at = Column(DateTime(timezone=True), server_default=func.now())

    ended_at = Column(DateTime(timezone=True), nullable=True)