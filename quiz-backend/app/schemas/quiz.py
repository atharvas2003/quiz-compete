from pydantic import BaseModel

class AnswerCheck(BaseModel):
    question_id: int
    option_id: int