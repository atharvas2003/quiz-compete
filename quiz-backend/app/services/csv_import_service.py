import csv
from io import StringIO

from sqlalchemy.orm import Session

from app.models.question import Question
from app.models.option import Option
from app.models.topic import Topic
from app.models.subtopic import SubTopic


VALID_DIFFICULTIES = {
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard"
}


def normalize(text: str) -> str:
    return " ".join(text.strip().split())


class CSVImportService:

    @staticmethod
    def import_csv(
        *,
        db: Session,
        file_content: bytes,
        topic_id: int,
        subtopic_id: int,
    ):

        ####################################################
        # Validate Selected Topic
        ####################################################

        topic = (
            db.query(Topic)
            .filter(
                Topic.id == topic_id
            )
            .first()
        )

        if not topic:

            return {
                "inserted": 0,
                "skipped": 0,
                "errors": [
                    "Selected topic does not exist."
                ]
            }

        ####################################################
        # Validate Selected Subtopic
        ####################################################

        subtopic = (
            db.query(SubTopic)
            .filter(
                SubTopic.id == subtopic_id
            )
            .first()
        )

        if not subtopic:

            return {
                "inserted": 0,
                "skipped": 0,
                "errors": [
                    "Selected subtopic does not exist."
                ]
            }

        if subtopic.topic_id != topic.id:

            return {
                "inserted": 0,
                "skipped": 0,
                "errors": [
                    "Selected subtopic does not belong to selected topic."
                ]
            }

        ####################################################
        # Read CSV
        ####################################################

        csv_data = StringIO(
            file_content.decode("utf-8")
        )

        reader = csv.DictReader(csv_data)

        inserted = 0
        skipped = 0
        errors = []

        ####################################################
        # Process Rows
        ####################################################

        for row_number, row in enumerate(reader, start=2):

            savepoint = db.begin_nested()

            try:

                ############################################
                # Question
                ############################################

                question_text = normalize(
                    row.get(
                        "question_text",
                        ""
                    )
                )

                if not question_text:

                    raise ValueError(
                        "Question cannot be empty."
                    )

                ############################################
                # Duplicate Question
                ############################################

                duplicate = (
                    db.query(Question)
                    .filter(
                        Question.question_text == question_text,
                        Question.topic_id == topic_id,
                        Question.subtopic_id == subtopic_id,
                    )
                    .first()
                )

                if duplicate:

                    raise ValueError(
                        "Duplicate question."
                    )

                ############################################
                # Difficulty
                ############################################

                difficulty = normalize(
                    row.get(
                        "difficulty",
                        ""
                    )
                ).lower()

                if difficulty not in VALID_DIFFICULTIES:

                    raise ValueError(
                        "Difficulty must be Easy, Medium or Hard."
                    )

                difficulty = VALID_DIFFICULTIES[
                    difficulty
                ]

                ############################################
                # Options
                ############################################

                options = [

                    normalize(
                        row.get(
                            "option1",
                            ""
                        )
                    ),

                    normalize(
                        row.get(
                            "option2",
                            ""
                        )
                    ),

                    normalize(
                        row.get(
                            "option3",
                            ""
                        )
                    ),

                    normalize(
                        row.get(
                            "option4",
                            ""
                        )
                    )

                ]

                if any(
                    option == ""
                    for option in options
                ):

                    raise ValueError(
                        "All four options are required."
                    )

                ############################################
                # Correct Option
                ############################################

                try:

                    correct_option = int(
                        row.get(
                            "correct_option",
                            ""
                        )
                    )

                except ValueError:

                    raise ValueError(
                        "Correct option must be a number (1-4)."
                    )

                if correct_option not in [1, 2, 3, 4]:

                    raise ValueError(
                        "Correct option must be between 1 and 4."
                    )

                ############################################
                # Create Question
                ############################################

                question = Question(

                    question_text=question_text,

                    difficulty=difficulty,

                    topic_id=topic_id,

                    subtopic_id=subtopic_id

                )

                db.add(question)

                db.flush()

                ############################################
                # Create Options
                ############################################

                for index, option_text in enumerate(
                    options,
                    start=1
                ):

                    option = Option(

                        option_text=option_text,

                        question_id=question.id,

                        is_correct=(
                            index == correct_option
                        )

                    )

                    db.add(option)

                savepoint.commit()

                inserted += 1

            except Exception as e:

                savepoint.rollback()

                skipped += 1

                errors.append({

                    "row": row_number,

                    "question": row.get(
                        "question_text",
                        ""
                    ),

                    "reason": str(e)

                })

        ####################################################
        # Commit Once
        ####################################################

        db.commit()

        ####################################################
        # Response
        ####################################################

        return {

            "message": "CSV Import Completed",

            "inserted": inserted,

            "skipped": skipped,

            "errors": errors

        }