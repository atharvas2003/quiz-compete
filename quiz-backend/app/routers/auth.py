from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy import func
from app.models.quiz_session import QuizSession

from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.core.oauth2 import get_current_user

from app.database.connection import get_db

from app.models.user import User

from app.schemas.user import UserCreate

from app.core.security import hash_password

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    #checking if username already exists

    existing_email = (
        db.query(User)
    .filter(User.email == user.email)
    .first()
)

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    #checking if username already exists

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )


    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
)

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }

# Login endpoint
from app.core.security import(
    verify_password,
    create_access_token
)

@router.post("/login")
def login_user(
    user_credentials: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print(user_credentials.username)
    print(user_credentials.password)

    print("LOGIN ATTEMPT")
    print("EMAIL:", user_credentials.username)

    user = (
        db.query(User)
        .filter(
            User.email == user_credentials.username
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        user_credentials.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        {
            "user_id": user.id,
            "email": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_quizzes =(
        db.query(QuizSession)
        .filter(QuizSession.user_id == current_user.id)
        .count()
    )

    best_session = (
        db.query(QuizSession)
        .filter(QuizSession.user_id == current_user.id)
        .order_by(QuizSession.percentage.desc())
        .first()
)

    best_score = best_session.percentage if best_session else 0 

    avg_score = (
        db.query(func.avg(QuizSession.percentage))
        .filter(QuizSession.user_id == current_user.id)
        .scalar()
)

    avg_score = round(avg_score or 0, 2)

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "total_quizzes": total_quizzes,
        "best_score": best_score,
        "average_score": avg_score
    }

