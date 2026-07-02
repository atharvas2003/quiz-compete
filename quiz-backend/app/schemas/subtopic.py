from pydantic import BaseModel


class SubTopicCreate(BaseModel):
    name: str
    topic_id: int


class SubTopicResponse(BaseModel):
    id: int
    name: str
    topic_id: int

    class Config:
        from_attributes = True