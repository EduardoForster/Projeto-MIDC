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
