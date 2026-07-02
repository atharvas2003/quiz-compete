from fastapi import APIRouter, Depends, HTTPException
from app.models.option import Option
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.quiz import AnswerCheck
from app.models.question import Question
from sqlalchemy import func
from app.models.quiz_session import QuizSession
from app.schemas.quiz_session import QuizStart
from app.models.quiz_attempt import QuizAttempt
from app.schemas.quiz_attempt import SubmitAnswer
from datetime import datetime
from app.core.oauth2 import get_current_user
from app.schemas.question import QuestionWithOptions
from app.models.user import User
from app.schemas.quiz_attempt import QuizReviewResponse
from app.models.subtopic import SubTopic
from app.models.topic import Topic

router = APIRouter(
    prefix = "/quiz",
    tags=["Quiz"]
)

@router.get("/random", response_model=list[QuestionWithOptions])
def get_random_questions(
    topic_id: int,
    count: int = 10,
    db: Session = Depends(get_db)
):
    subtopics = (
        db.query(SubTopic)
        .filter(SubTopic.topic_id == topic_id)
        .all()
    )
    subtopic_ids = [
        subtopic.id
        for subtopic in subtopics
    ]


    question = (
        db.query(Question)
        .filter(Question.subtopic_id.in_(subtopic_ids))
        .order_by(func.random())
        .limit(count)
        .all()
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="No questions found for the specified subtopic."
        )
    
    return question

@router.post("/start")
def start_quiz(
    quiz: QuizStart,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    print("CURRENT USER:")
    print(current_user.id)
    print(current_user.email)
    
    print("START QUIZ HIT")
    new_session = QuizSession(
        user_id = current_user.id,
        topic_id = quiz.topic_id,
        total_questions = quiz.total_questions
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    return new_session

@router.post("/submit")
def submit_quiz(
    answer: SubmitAnswer,
    db: Session = Depends(get_db)
):
    print("Submit quiz hit")
    session = (
        db.query(QuizSession)
        .filter(QuizSession.id == answer.session_id)
        .first()
    )
    if not session:
        raise HTTPException(
            status_code = 404,
            detail="session not found"
        )
    
    option = (
        db.query(Option)
        .filter(Option.id == answer.option_id)
        .first()
    )
    if not option:
        raise HTTPException(
            status_code = 404,
            detail="option not found"
        )
    if option.question_id != answer.question_id:
        raise HTTPException(
            status_code=404,
            detail="option does not belong to this question"
        )
    existing_attempt = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.session_id == answer.session_id,
            QuizAttempt.question_id == answer.question_id
        )
        .first()
    )
    if existing_attempt:
        raise HTTPException(
            status_code=400,
            detail="Question already answered"
        )
    

    attempt = QuizAttempt(
        session_id = answer.session_id,
        question_id = answer.question_id,
        options_id = answer.option_id,
        is_correct= option.is_correct
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    print(attempt.id)

    if option.is_correct:
        session.correct_answers+=1
    else:
        session.wrong_answers+=1

    answered_questions = (
        session.correct_answers + 
        session.wrong_answers
        
    )
    if answered_questions > 0:
        session.percentage = (
        session.correct_answers / answered_questions
    ) * 100
        
    session.score = session.correct_answers * 100

    if answered_questions >= 10:
        session.is_completed = True
        session.ended_at = datetime.utcnow()

    correct_option = (
        db.query(Option)
        .filter(
            Option.question_id == answer.question_id,
            Option.is_correct == True
        )
        .first()
    )
    db.commit()
    db.refresh(session)

    return{
        "is_correct": option.is_correct,
        "correct_option": correct_option.option_text,
        "correct_answers": session.correct_answers,
        "wrong_answers": session.wrong_answers,
        "percentage": session.percentage
    }

@router.post("/finish/{session_id}")
def finish_quiz(
    session_id: int,
    db:Session = Depends(get_db)
):
    session = (
        db.query(QuizSession)
        .filter(QuizSession.id == session_id)
        .first()
    )
    if not session:
        raise HTTPException(
            status_code=404,
            detail="session not found"
        )
    
    session.is_completed = True
    session.ended_at = datetime.now()

    db.commit()
    db.refresh(session)

    return{
        "session_id": session.id,
        "correct_answers": session.correct_answers,
        "wrong_answers": session.wrong_answers,
        "percentage": session.percentage,
        "is_completed": session.is_completed
    }

@router.get("/result/{session.id}")
def get_result(
    session_id: int,
    db: Session = Depends(get_db)
):
    session = (
        db.query(QuizSession)
        .filter(QuizSession.id == session_id)
        .first()
    )
    if not session:
        raise HTTPException(
            status_code = 404,
            detail="Session not found"
        )
    return {
        "session_id": session.id,
        "total_questions": session.total_questions,
        "correct_questions": session.correct_answers,
        "wrong_questions": session.wrong_answers,
        "percentage": session.percentage,
        "is_completed": session.is_completed,
        "started_at": session.started_at,
        "ended_at": session.ended_at
    }

@router.get("/history")
def quiz_history(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    sessions = (
        db.query(QuizSession)
        .filter(
            QuizSession.user_id == current_user.id
        )
        .order_by(QuizSession.id.desc())
        .all()
    )

    return [
        {
            "session_id": session.id,
            "total_questions": session.total_questions,
            "correct_answers": session.correct_answers,
            "wrong_answers": session.wrong_answers,
            "percentage": session.percentage,
            "is_completed": session.is_completed,
            "started_at": session.started_at,
            "ended_at": session.ended_at
        }
        for session in sessions
    ]
@router.get(
    "/review{session.id}"
)
def review_quiz(
    session_id: int,
    db: Session= Depends(get_db)
):
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.session_id == session_id)
        .all()
    )
    review = []

    for attempt in attempts:

        question = (
            db.query(Question)
            .filter(
                Question.id == attempt.question_id
            )
            .first()
        )

        your_answer = (
            db.query(Option)
            .filter(
                Option.id == attempt.options_id
            )
            .first()
        )

        correct_answer = (
            db.query(Option)
            .filter(
                Option.question_id == attempt.question_id,
                Option.is_correct == True
            )
            .first()
        )

        review.append({
            "question": question.question_text,
            "user_answer": your_answer.option_text,
            "correct_answer": correct_answer.option_text,
            "is_correct": attempt.is_correct
        })

    return review


@router.get("/history/{session_id}")
def get_session_review(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    session = (
        db.query(QuizSession)
        .filter(
            QuizSession.id == session_id,
            QuizSession.user_id == current_user.id
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    attempts = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.session_id == session_id
        )
        .all()
    )

    review_data = []

    for attempt in attempts:

        question = (
            db.query(Question)
            .filter(
                Question.id == attempt.question_id
            )
            .first()
        )

        selected_option = (
            db.query(Option)
            .filter(
                Option.id == attempt.options_id
            )
            .first()
        )

        correct_option = (
            db.query(Option)
            .filter(
                Option.question_id == attempt.question_id,
                Option.is_correct == True
            )
            .first()
        )

        review_data.append(
            {
                "question_text": question.question_text,
                "user_answer": selected_option.option_text,
                "correct_answer": correct_option.option_text,
                "is_correct": attempt.is_correct
            }
        )

    return review_data

@router.get("/topics")
def get_topics(
    db: Session = Depends(get_db)
):
    return (
        db.query(Topic)
        .all()
    )
