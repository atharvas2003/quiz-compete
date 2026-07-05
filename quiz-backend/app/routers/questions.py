from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.option import Option

from app.database.connection import get_db

from app.core.oauth2 import admin_only
from app.models.user import User

from app.models.question import Question
from app.schemas.question import (
    PaginatedQuestionResponse,
    QuestionCreate,
    QuestionResponse,
    QuestionWithOptions,
    QuestionUpdate,
    PaginatedQuestionResponse
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
@router.get("/", response_model=PaginatedQuestionResponse)
def get_questions(
    topic_id: int | None = None,
    subtopic_id: int | None = None,
    difficulty: str | None = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):

    query = db.query(Question)

    if topic_id is not None:
        query = query.filter(
            Question.topic_id == topic_id
        )

    if subtopic_id is not None:
        query = query.filter(
            Question.subtopic_id == subtopic_id
        )

    if difficulty is not None:
        query = query.filter(
            Question.difficulty == difficulty
        )

    total = query.count()

    questions = (
        query
        .order_by(Question.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "questions": questions
    }

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

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    updated_question: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
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

    question.question_text = updated_question.question_text
    question.difficulty = updated_question.difficulty
    question.topic_id = updated_question.topic_id
    question.subtopic_id = updated_question.subtopic_id

    db.commit()
    db.refresh(question)

    return question

@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
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

    db.delete(question)
    db.commit()

    return {
        "message": "Question deleted successfully"
    }
