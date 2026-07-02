from fastapi import APIRouter
from fastapi import Depends

from app.core.oauth2 import get_current_user

from app.schemas.user import UserResponse


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/test")
def test_user_route():
    return {
        "message": "User route is working!"
    }

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user=Depends(get_current_user)
):
    return current_user