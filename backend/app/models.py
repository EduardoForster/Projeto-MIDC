from datetime import datetime, date

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Funcionario(Base):
    __tablename__ = "funcionarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    departamento = Column(String(80), nullable=False)

    registros = relationship(
        "Registro", back_populates="funcionario", cascade="all, delete-orphan"
    )


class Registro(Base):
    """
    Um registro por envio. Nunca é sobrescrito: cada data de referência
    nova para o mesmo funcionário gera uma linha nova nesta tabela
    (ver REGRA DE HISTÓRICO no desafio).
    """

    __tablename__ = "registros"

    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(
        Integer, ForeignKey("funcionarios.id"), nullable=False, index=True
    )
    data_referencia = Column(Date, nullable=False, index=True)
    quantidade_entregas = Column(Integer, nullable=False)
    observacao = Column(Text, nullable=True)
    data_criacao = Column(DateTime, default=datetime.utcnow, nullable=False)

    funcionario = relationship("Funcionario", back_populates="registros")
