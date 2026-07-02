from pydantic import BaseModel

class SubmitAnswer(BaseModel):
    session_id: int
    question_id: int
    option_id: int

class QuizReviewResponse(BaseModel):
    question: str
    user_answer: str
    correct_answer: str
    is_correct: bool

class QuizAttemptCreate(BaseModel):
    score: int
    total_questions: int