from pydantic import BaseModel

class QuizStart(BaseModel):
    topic_id: int
    total_questions: int
    
class QuizSessionResponse(BaseModel):
    id: int
    topic_id: int
    user_id: int
    total_questions: int
    correct_answers: int
    wrong_answers: int
    score: int
    percentage: float
    is_completed: bool
    class Config:
        from_attributes = True