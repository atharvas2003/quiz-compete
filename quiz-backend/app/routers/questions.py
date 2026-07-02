from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.option import Option

from app.database.connection import get_db

from app.core.oauth2 import admin_only
from app.models.user import User

from app.models.question import Question
from app.schemas.question import (
    QuestionCreate,
    QuestionResponse,
    QuestionWithOptions
)
router = APIRouter(
    prefix="/questions",
    tags=["Questions"]
)

# Create Question
@router.post("/", response_model=QuestionResponse)
def create_question(
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):

    new_question = Question(
        question_text=question.question_text,
        difficulty=question.difficulty,
        topic_id=question.topic_id,
        subtopic_id=question.subtopic_id
    )

    db.add(new_question)
    db.commit()
    db.refresh(new_question)

    return new_question


# Get All Questions
@router.get("/", response_model=list[QuestionResponse])
def get_questions(
    db: Session = Depends(get_db)
):

    return db.query(Question).all()


# Get Single Question
@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db)
):

    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    return question

# Get Question with Options
@router.get("/{question_id}/options")
def get_question_with_options(
    question_id: int,
    db: Session = Depends(get_db)
):
    question = (
        db.query(Question)
        .filter(Question.id == question_id)
        .first()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )
    
    print(Option)

    options = (
        db.query(Option)
        .filter(Option.question_id == question_id)
        .all()
    )

    return {
        "id": question.id,
        "question_text": question.question_text,
        "difficulty": question.difficulty,
        "topic_id": question.topic_id,
        "subtopic_id": question.subtopic_id,
        "options": options
    }

@router.get("/subtopic/{subtopic_id}",
            response_model=list[QuestionResponse])
def get_questions_by_subtopic(
    subtopic_id: int,
    db: Session = Depends(get_db)
):
    questions = (
        db.query(Question)
        .filter(Question.subtopic_id == subtopic_id)
        .all()
    )
    return questions