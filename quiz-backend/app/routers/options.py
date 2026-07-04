from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.core.oauth2 import admin_only
from app.models.user import User

from app.models.option import Option
from app.schemas.option import (
    OptionCreate,
    OptionResponse,
    OptionUpdate
)

router = APIRouter(
    prefix="/options",
    tags=["Options"]
)

@router.post("/", response_model=OptionResponse)
def create_option(
    option: OptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):

    new_option = Option(
        option_text=option.option_text,
        is_correct=option.is_correct,
        question_id=option.question_id
    )

    db.add(new_option)
    db.commit()
    db.refresh(new_option)

    return new_option

@router.get("/", response_model=list[OptionResponse])
def get_options(
    db: Session = Depends(get_db)
):

    return db.query(Option).all()

@router.get("/{option_id}", response_model=OptionResponse)
def get_option(
    option_id: int,
    db: Session = Depends(get_db)
):

    option = (
        db.query(Option)
        .filter(Option.id == option_id)
        .first()
    )

    if not option:
        raise HTTPException(
            status_code=404,
            detail="Option not found"
        )

    return option

@router.put("/{option_id}", response_model=OptionResponse)
def update_option(
    option_id: int,
    updated_option: OptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):

    option = (
        db.query(Option)
        .filter(Option.id == option_id)
        .first()
    )

    if not option:
        raise HTTPException(
            status_code=404,
            detail="Option not found"
        )

    option.option_text = updated_option.option_text
    option.is_correct = updated_option.is_correct

    db.commit()
    db.refresh(option)

    return option