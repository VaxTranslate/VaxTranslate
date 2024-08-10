from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    sns_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    vaccine_records = relationship('VaccineRecord', back_populates='user')

class Country(Base):
    __tablename__ = 'country'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)

    vaccine_records = relationship('VaccineRecord', back_populates='country')

class Language(Base):
    __tablename__ = 'language'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False, unique=True)

    vaccine_records = relationship('VaccineRecord', back_populates='language')

class Vaccine(Base):
    __tablename__ = 'vaccine'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)

    vaccine_vaccine_records = relationship('VaccineVaccineRecord', back_populates='vaccine')

class VaccineRecord(Base):
    __tablename__ = 'vaccine_record'
    id = Column(Integer, primary_key=True, autoincrement=True)
    image_url = Column(String, nullable=False)
    is_translated = Column(Boolean, default=False)
    page_number = Column(Integer, nullable=False)
    record_type = Column(String, nullable=False)
    translation_score = Column(Integer, nullable=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    country_id = Column(Integer, ForeignKey('country.id'), nullable=False)
    language_id = Column(Integer, ForeignKey('language.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship('User', back_populates='vaccine_records')
    country = relationship('Country', back_populates='vaccine_records')
    language = relationship('Language', back_populates='vaccine_records')
    detected_texts = relationship('DetectedText', back_populates='vaccine_record')
    translated_texts = relationship('TranslatedText', back_populates='vaccine_record')
    vaccine_vaccine_records = relationship('VaccineVaccineRecord', back_populates='vaccine_record')

class VaccineVaccineRecord(Base):
    __tablename__ = 'vaccine_vaccine_record'
    id = Column(Integer, primary_key=True, autoincrement=True)
    vaccine_id = Column(Integer, ForeignKey('vaccine.id'), nullable=False)
    vaccine_record_id = Column(Integer, ForeignKey('vaccine_record.id'), nullable=False)

    vaccine = relationship('Vaccine', back_populates='vaccine_vaccine_records')
    vaccine_record = relationship('VaccineRecord', back_populates='vaccine_vaccine_records')

class DetectedText(Base):
    __tablename__ = 'detected_text'
    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String, nullable=False)
    x_coordinate = Column(Integer, nullable=False)
    y_coordinate = Column(Integer, nullable=False)
    vaccine_record_id = Column(Integer, ForeignKey('vaccine_record.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    vaccine_record = relationship('VaccineRecord', back_populates='detected_texts')

class TranslatedText(Base):
    __tablename__ = 'translated_text'
    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String, nullable=False)
    x_coordinate = Column(Integer, nullable=False)
    y_coordinate = Column(Integer, nullable=False)
    vaccine_record_id = Column(Integer, ForeignKey('vaccine_record.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    vaccine_record = relationship('VaccineRecord', back_populates='translated_texts')
