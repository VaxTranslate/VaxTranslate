from sqlalchemy import create_engine
from dotenv import load_dotenv
from dbModels import Base
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

Base.metadata.drop_all(engine) 
Base.metadata.create_all(engine)

print("Database initialized successfully.")