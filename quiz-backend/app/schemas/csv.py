from pydantic import BaseModel


class CSVUploadResponse(BaseModel):
    inserted: int
    skipped: int
    errors: list[str]

    class Config:
        from_attributes = True