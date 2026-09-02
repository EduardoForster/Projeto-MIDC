# Cadastro e painel de indicadores de funcionários

Desafio técnico — desenvolvimento full stack (nível estágio).

## Como iniciar

1. Copie `.env.example` para `.env` (os valores padrão já funcionam para rodar localmente):
   ```bash
   cp .env.example .env
   ```
2. Suba tudo com:
   ```bash
   docker compose up --build
   ```
   
Observação: o passo acima pressupõe que você tenha o Docker Desktop (ou Docker Engine + Compose) instalado e ativo na máquina.

Executando sem Docker (opção rápida para desenvolvimento local)

Caso não tenha Docker instalado e queira testar apenas a API localmente, você pode rodar o backend com um banco SQLite (apenas para desenvolvimento/local). Exemplo em PowerShell:

```powershell
cd C:\Users\aluno\Desktop\project-root\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --no-cache-dir -r requirements.txt
#$env:DATABASE_URL = "sqlite:///C:/Users/aluno/Desktop/project-root/backend/test.db"
#$env:PYTHONPATH = "."
setx DATABASE_URL "sqlite:///C:/Users/aluno/Desktop/project-root/backend/test.db"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Observações:
- Com a variável `DATABASE_URL` apontando para SQLite o backend criará um arquivo `test.db` em `backend/` e você terá a API em `http://localhost:8000` e a documentação em `http://localhost:8000/docs`.
- Para testar os frontends localmente sem Docker, entre nas pastas `frontend-angular` e `frontend-react`, execute `npm install` e depois `npm start` (Angular) ou `npm run dev` (React). Ajuste a variável `API_URL` nos arquivos `frontend-angular/src/app/core/record.service.ts` e `frontend-react/src/api/records.js` para `http://localhost:8000` se necessário.

## Portas

| Serviço              | URL                              |
|-----------------------|-----------------------------------|
| API (FastAPI)          | http://localhost:8000            |
| Documentação da API     | http://localhost:8000/docs       |
| Frontend Angular (cadastro) | http://localhost:4200        |
| Frontend React (painel) | http://localhost:5173           |

## Arquitetura e decisões

- **Backend (FastAPI + SQLAlchemy + PostgreSQL):** três rotas mínimas — `POST /records`, `GET /records` e `GET /summary` — separadas de models e schemas. As tabelas são criadas automaticamente no start-up (`Base.metadata.create_all`), como alternativa simplificada a migrations dentro do tempo disponível.
- **Regra de histórico:** cada envio sempre cria uma nova linha na tabela `registros`, associada ao `funcionario_id`. Nenhum registro anterior é sobrescrito quando uma nova data de referência é cadastrada — a busca por funcionário existente serve apenas para não duplicar a tabela `funcionarios`.
- **Angular:** tela única com um `ReactiveForm`, validação de campos obrigatórios e de valor não negativo, e um serviço HTTP dedicado (`RecordService`) para o `POST /records`.
- **React + Tailwind:** três componentes simples (`SummaryCards`, `DeliveriesChart`, `RecordsTable`) que consomem `GET /summary` e `GET /records`, com estados de carregamento e erro.
- **Sem autenticação:** conforme permitido pelo desafio, a separação de perfis é representada pelas duas aplicações (Angular = entrada, React = consulta).

## Limitações conhecidas / itens não concluídos

> Preencha esta seção ao final da prova com o que realmente ficou pendente dentro das 4 horas (ex.: sem testes automatizados, sem paginação, sem Alembic, etc.).
