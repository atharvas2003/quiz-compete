from pydantic import BaseModel

class OptionCreate(BaseModel):
    option_text: str
    is_correct: bool
    question_id: int
    
class OptionUpdate(BaseModel):
    option_text: str
    is_correct: bool

    class Config:
        from_attributes = True

class OptionResponse(BaseModel):
    id: int
    option_text: str
    is_correct: bool
    question_id: int

    class Config:
        from_attributes = True

class OptionNested(BaseModel):
    id: int
    option_text: str
    is_correct: bool

    class Config:
        from_attributes = True  