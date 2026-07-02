from pydantic import BaseModel
from app.schemas.option import OptionNested

class QuestionCreate(BaseModel):
    question_text: str
    difficulty: str
    
    topic_id: int
    subtopic_id: int

class QuestionResponse(BaseModel):
    id: int
    question_text: str
    difficulty: str
    
    topic_id: int
    subtopic_id: int

    class Config:
        from_attributes = True

class QuestionWithOptions(BaseModel):
    id: int
    question_text: str
    difficulty: str
    topic_id: int
    subtopic_id: int
    options: list[OptionNested]

    class Config:
        from_attributes = True