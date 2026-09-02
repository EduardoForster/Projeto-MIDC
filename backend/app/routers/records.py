from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(tags=["records"])


def _get_or_create_funcionario(
    db: Session, nome: str, departamento: str
) -> models.Funcionario:
    funcionario = (
        db.query(models.Funcionario)
        .filter(
            models.Funcionario.nome == nome,
            models.Funcionario.departamento == departamento,
        )
        .first()
    )
    if funcionario is None:
        funcionario = models.Funcionario(nome=nome, departamento=departamento)
        db.add(funcionario)
        db.flush()  # garante o id sem fechar a transação
    return funcionario


@router.post("/records", response_model=schemas.RegistroOut, status_code=201)
def create_record(payload: schemas.RegistroCreate, db: Session = Depends(get_db)):
    funcionario = _get_or_create_funcionario(db, payload.nome, payload.departamento)

    # IMPORTANTE: sempre cria uma linha nova. Nunca faz update de um
    # registro existente, mesmo que a mesma data de referência já exista
    # para o funcionário — isso é a regra de histórico do desafio.
    registro = models.Registro(
        funcionario_id=funcionario.id,
        data_referencia=payload.data_referencia,
        quantidade_entregas=payload.quantidade_entregas,
        observacao=payload.observacao,
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)

    return _to_registro_out(registro, funcionario)


@router.get("/records", response_model=List[schemas.RegistroOut])
def list_records(db: Session = Depends(get_db)):
    registros = (
        db.query(models.Registro)
        .join(models.Funcionario)
        .order_by(models.Registro.data_referencia.desc())
        .all()
    )
    return [_to_registro_out(r, r.funcionario) for r in registros]


@router.get("/summary", response_model=schemas.SummaryOut)
def get_summary(db: Session = Depends(get_db)):
    total_registros = db.query(func.count(models.Registro.id)).scalar() or 0
    total_entregas = (
        db.query(func.coalesce(func.sum(models.Registro.quantidade_entregas), 0)).scalar()
        or 0
    )
    media = (total_entregas / total_registros) if total_registros else 0.0

    return schemas.SummaryOut(
        total_registros=total_registros,
        total_entregas=total_entregas,
        media_entregas=round(media, 2),
    )


def _to_registro_out(
    registro: models.Registro, funcionario: models.Funcionario
) -> schemas.RegistroOut:
    return schemas.RegistroOut(
        id=registro.id,
        nome=funcionario.nome,
        departamento=funcionario.departamento,
        data_referencia=registro.data_referencia,
        quantidade_entregas=registro.quantidade_entregas,
        observacao=registro.observacao,
        data_criacao=registro.data_criacao,
    )
