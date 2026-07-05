from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer

from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.models.user import User

from app.core.security import verify_access_token


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    

    payload = verify_access_token(token)

    

    if payload is None:
        
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )
    

    user = (
        db.query(User)
        .filter(
            User.id == payload["user_id"]
        )
        .first()
    )


    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User Not Found"
        )

    return user

"""
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    print("TOKEN:", token)

    payload = verify_access_token(token)

    print("PAYLOAD:", payload)

    return db.query(User).first()

"""

def admin_only(
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin only"
        )
    return current_user

