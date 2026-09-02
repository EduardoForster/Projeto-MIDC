from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class RegistroCreate(BaseModel):
    nome: str = Field(..., min_length=1)
    departamento: str = Field(..., min_length=1)
    data_referencia: date
    quantidade_entregas: int = Field(..., ge=0)
    observacao: Optional[str] = None


class RegistroOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nome: str
    departamento: str
    data_referencia: date
    quantidade_entregas: int
    observacao: Optional[str] = None
    data_criacao: datetime


class SummaryOut(BaseModel):
    total_registros: int
    total_entregas: int
    media_entregas: float
