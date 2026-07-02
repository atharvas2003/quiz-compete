import csv
from io import StringIO

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.question import Question
from app.models.option import Option

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    content = await file.read()

    csv_data = StringIO(
        content.decode("utf-8")
    )

    reader = csv.DictReader(csv_data)

    inserted = 0
    skipped = 0

    for row in reader:

        # Check duplicate question
        existing_question = (
            db.query(Question)
            .filter(
                Question.question_text ==
                row["question_text"]
            )
            .first()
        )

        if existing_question:
            skipped += 1
            continue

        # Create Question
        question = Question(
            question_text=row["question_text"],
            difficulty=row["difficulty"],
            topic_id=int(row["topic_id"]),
            subtopic_id=int(row["subtopic_id"])
        )

        db.add(question)
        db.commit()
        db.refresh(question)

        correct_option = " ".join(
            row["correct_option"].split()
            ).lower()

        # Create Options
        options = [
            row["option1"],
            row["option2"],
            row["option3"],
            row["option4"]
        ]

        for option_text in options:

            normalized_option = " ".join(option_text.split()
                                         ).lower()
            
            is_correct = (normalized_option == correct_option)

            option = Option(
                option_text=option_text,
                question_id=question.id,
                is_correct=is_correct,

            )

            db.add(option)

        db.commit()

        inserted += 1

    return {
        "message": "Upload Complete",
        "inserted": inserted,
        "skipped": skipped
    }