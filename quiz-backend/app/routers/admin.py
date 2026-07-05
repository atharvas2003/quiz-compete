from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Form
from fastapi import Depends

from sqlalchemy.orm import Session
from app.core.oauth2 import admin_only

from app.database.connection import get_db
from app.models.user import User
from app.services.csv_import_service import CSVImportService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.post("/upload-csv")
async def upload_csv(
    topic_id: int = Form(...),
    subtopic_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_only)
):
    content = await file.read()

    return CSVImportService.import_csv(
        db=db,
        file_content=content,
        topic_id=topic_id,
        subtopic_id=subtopic_id
    )