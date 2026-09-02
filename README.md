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

Nota sobre Docker
-----------------

Durante o desenvolvimento eu preparei `Dockerfile`s e um `docker-compose.yml` para orquestrar os serviços. Porém, não foi possível iniciar os containers no meu ambiente por falta de privilégios de administrador para instalar/ativar o Docker Desktop. Por isso a verificação final do 'docker compose up --build' não foi executada aqui.

O projeto foi ajustado para rodar sem Docker (modo local): use a instrução acima para executar o backend via Uvicorn com SQLite ou a configuração `DATABASE_URL` apontando para um PostgreSQL em execução. Quando o Docker Desktop estiver disponível na sua máquina, o `docker compose up --build` deve subir `db`, `backend`, `frontend-angular` e `frontend-react` conforme o `docker-compose.yml`.

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

Durante o tempo disponível (limite de prova) este foi o escopo e o que ficou pendente:

- Tempo e escopo:
   - Prazo (4 horas) — entregamos uma aplicação mínima funcional com backend e um dashboard, priorizando funcionalidade end‑to‑end sobre extras.

- Itens implementados:
   - Backend com FastAPI, SQLAlchemy e endpoints mínimos (`POST /records`, `GET /records`, `GET /summary`).
   - Persistência testada localmente com SQLite (arquivo `backend/test.db`).
   - Frontend React (painel) implementado e em execução com Vite, consumindo a API.
   - Frontend Angular (formulário) implementado; dependências instaladas, mas ainda com problema de compilação em algumas máquinas (ver notas abaixo).

- Itens não concluídos / pendentes (dentro do tempo de prova):
   - Migrations (Alembic) não configurado — usei `Base.metadata.create_all` para simplificar no escopo da prova.
   - Testes automatizados além do smoke test (`backend/test_api.py`) — não houve tempo para testes unitários/integração completos.
   - Paginação e filtros avançados para `GET /records` — implementações básicas retornam todos os registros.
   - Autenticação/autorização — a aplicação é pública para simplificar o desafio.
   - Validação e tratamento de erros mais abrangentes (ex.: retry, circuit-breaker) — mínimos necessários foram implementados.
   - Execução em Docker não verificada localmente devido à falta de privilégios para ativar Docker Desktop na máquina onde o trabalho foi realizado.

- Observações sobre Angular (pendência prática):
   - Em alguns ambientes Windows a execução `ng serve` apresentou erros de compilação TypeScript relacionados a declarações ESM e resolução de tipos (`TS2307`, `NG2003`). Reinstalar `node_modules`, alinhar `tsconfig.json` e reiniciar o servidor TypeScript do editor geralmente resolve; documentamos os passos no README, mas a correção final depende do ambiente local (Node version / cache do npm / TS server).

Esta lista resume o que foi possível entregar nas 4 horas e os pontos que ficaram para melhoria posterior; o repositório contém todos os artefatos produzidos até aqui.

## Estado atual (2026-09-02)

- **Backend:** funcionando localmente via Uvicorn com SQLite (variável `DATABASE_URL` apontando para `sqlite:///.../backend/test.db`). Subi o servidor localmente para desenvolvimento e os testes básicos (`backend/test_api.py`) retornaram POST 201 e GET 200.
- **Dependências do backend:** substituí `psycopg2-binary` por `psycopg[binary]==3.3.5` (psycopg v3 binário) no `backend/requirements.txt` para evitar falhas de build no Windows. Instalação concluída na venv `backend/.venv`.
- **React (painel):** dependências instaladas e servidor Vite em execução com `VITE_API_URL` apontando para o backend local. Aplicação disponível em `http://localhost:5173/`.
- **Angular (formulário):** dependências instaladas, porém o `ng serve` falhou ao compilar devido a erros TypeScript relacionados a declarações de tipos ESM (`TS2307` para `@angular/common` / `@angular/common/http` e `rxjs`) e erros de injeção (`NG2003`). Esses erros ocorreram mesmo após ajustes de `tsconfig.json` — provável causa: resolução/declarações ESM não encontradas ou instalação parcial de tipos. A aplicação Angular não está servindo corretamente no momento.

### Como reproduzir localmente (rápido)

- Backend (PowerShell):
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --no-cache-dir -r requirements.txt
setx DATABASE_URL "sqlite:///C:/Users/aluno/Desktop/project-root/backend/test.db"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

- React (painel):
```powershell
cd frontend-react
npm install --no-audit --no-fund --legacy-peer-deps
set VITE_API_URL=http://localhost:8001
npm run dev
```

- Angular (formulário) — tentativa e passos sugeridos:
```powershell
cd frontend-angular
# limpar e reinstalar dependências
rd /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --no-audit --no-fund --legacy-peer-deps
# então iniciar
npm start
```

Se o `ng serve` continuar com erros de declaração de tipos, verifique a versão do Node (recomendada pelo `@angular/cli`), reinstale `node_modules` e confirme que os pacotes `@angular/*` e `rxjs` foram instalados corretamente. Como alternativa temporária, documente o erro e execute apenas o backend+React para validação funcional.

### Nota sobre Docker

- Os `Dockerfile`s e `docker-compose.yml` estão preparados, mas não foi possível executar `docker compose up --build` neste ambiente por ausência de privilégios administrativos para instalar/ativar o Docker Desktop. Portanto, a validação final em containers não foi realizada aqui.

### Próximos passos recomendados

- Resolver o problema de tipos do Angular (reinstalar dependências; alinhar `tsconfig` e `moduleResolution` conforme versão do Node/CLI). Se quiser, eu continuo tentando essas correções.
- Opcional: quando o Docker Desktop estiver disponível, testar `docker compose up --build` para validar todo o fluxo em containers.

**Dependências — Usadas vs Opcionais**

- **Backend (`backend/requirements.txt`)**:
   - Usadas: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic` — necessárias para rodar a API localmente.
   - Opcionais/condicionais: `psycopg[binary]` — necessária apenas se for conectar a um PostgreSQL em produção; o ambiente local de desenvolvimento usa SQLite por padrão (variável `DATABASE_URL`).

- **Frontend Angular (`frontend-angular/package.json`)**:
   - Usadas: `@angular/*` e `rxjs`, `zone.js`, `tslib` — dependências essenciais para o formulário e o `RecordService`.
   - Dev: `@angular/cli`, `@angular-devkit/build-angular`, `typescript` — usadas para desenvolvimento e build local.

- **Frontend React (`frontend-react/package.json`)**:
   - Usadas: `react`, `react-dom`, `recharts` — UI e gráficos.
   - Dev: `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer` — usadas no pipeline de desenvolvimento e build.

- **Docker / Orquestração**:
   - Arquivos `Dockerfile` e `docker-compose.yml` estão presentes e preparados, mas não foram executados neste ambiente por falta de privilégios administrativos para instalar/ativar Docker Desktop. Portanto, os containers não foram testados aqui.

Esta lista contempla as dependências referenciadas nos manifests do projeto e se destinam a documentar o que é necessário para executar cada serviço. Pacotes adicionais que possam aparecer em instalações locais (por exemplo, sub-dependências do `node_modules`) não estão listados aqui — apenas as dependências top-level declaradas nos `package.json` e `requirements.txt`.

