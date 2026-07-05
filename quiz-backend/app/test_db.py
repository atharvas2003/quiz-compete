from sqlalchemy import text
from app.database.connection import engine

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
       
except Exception as e:
   