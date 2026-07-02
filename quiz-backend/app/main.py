from fastapi import FastAPI

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.topics import router as topics_router
from app.routers.subtopics import router as subtopics_router
from app.routers.questions import router as questions_router
from app.routers.options import router as options_router
from app.routers.quiz import router as quiz_router
from app.models.quiz_session import QuizSession
from app.models.quiz_attempt import QuizAttempt
from fastapi.middleware.cors import CORSMiddleware
from app.routers import admin


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(topics_router)
app.include_router(users_router)
app.include_router(subtopics_router)
app.include_router(questions_router)
app.include_router(options_router)
app.include_router(quiz_router) 
app.include_router(admin.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Quiz App API!"
    }