from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.topic import Topic
from app.schemas.topic import TopicCreate, TopicResponse
from app.core.oauth2 import admin_only
from app.models.user import User


router = APIRouter(
    prefix="/topics",
    tags=["Topics"]
)

@router.post("/", response_model=TopicResponse)
def create_topic(
    topic: TopicCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    existing_topic = (
        db.query(Topic)
        .filter(Topic.name == topic.name)
        .first()
    )
    if existing_topic:
        raise HTTPException(
            status_code=400,
            detail="Topic already exists"
        )
    new_topic = Topic(
        name=topic.name
    )

    db.add(new_topic)
    db.commit()
    db.refresh(new_topic)

    return new_topic

@router.get("/topics", response_model=list[TopicResponse])
def get_topics(
    db: Session = Depends(get_db)
):
    return db.query(Topic).all()

@router.get("/{topic_id}", response_model=TopicResponse)
def get_topic(
    topic_id: int,
    db: Session = Depends(get_db)
):

    topic = (
        db.query(Topic)
        .filter(Topic.id == topic_id)
        .first()
    )

    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    return topic

