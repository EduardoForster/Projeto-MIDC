from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import records

# Cria as tabelas no start-up. Para o escopo do desafio isso substitui
# migrations (Alembic é citado como diferencial no enunciado).
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Indicadores de Funcionários API",
    description="Cadastro e painel de indicadores de funcionários — desafio técnico.",
    version="1.0.0",
)

# Libera CORS para os dois frontends (ajuste as portas se mudar o compose).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(records.router)


@app.get("/health")
def health():
    return {"status": "ok"}
