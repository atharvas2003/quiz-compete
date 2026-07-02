
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.models.subtopic import SubTopic
from app.models.topic import Topic
from app.core.oauth2 import admin_only
from app.models.user import User
from app.models.subtopic import SubTopic

from app.schemas.subtopic import (
    SubTopicCreate,
    SubTopicResponse
)

router = APIRouter(
    prefix="/subtopics",
    tags=["Sub Topics"]
)

@router.post("/", response_model=SubTopicResponse)
def create_subtopic(
    subtopic: SubTopicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):

    topic = (
        db.query(Topic)
        .filter(Topic.id == subtopic.topic_id)
        .first()
    )

    if not topic:
        raise HTTPException(
            status_code=400,
            detail="Sub not found"
        )

    new_subtopic = SubTopic(
        name=subtopic.name,
        topic_id=subtopic.topic_id
    )

    db.add(new_subtopic)
    db.commit()
    db.refresh(new_subtopic)

    return new_subtopic

@router.get("/", response_model=list[SubTopicResponse])
def get_subtopics(
    db: Session = Depends(get_db)
):
    return db.query(SubTopic).all()

@router.get("/{subtopic_id}", response_model=SubTopicResponse)
def get_subtopic(
    subtopic_id: int,
    db: Session = Depends(get_db)
):
    subtopic = (
        db.query(SubTopic)
        .filter(SubTopic.id == subtopic_id)
        .first()
    )

    if not subtopic:
        raise HTTPException(
            status_code=400,
            detail="Subtopic not found"
        )

    return subtopic

@router.get("/topic/{topic_id}")
def get_subtopics_by_topic(
    topic_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(SubTopic)
        .filter(SubTopic.topic_id == topic_id)
        .all()
    )

