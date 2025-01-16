# Sistema de Agendamento de Reuniões - API

API do sistema **Agendamento de Reuniões** para gerenciar eventos, participantes e notificações.

## Instalação

### Usando Docker

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/lfqcamargo/agendamento-reuniao.git
   cd agendamento-reuniao/api
   ```

2. **Suba os contêineres com Docker:**
   ```bash
   docker-compose up --d
   ```

3. **Acesse a API:**
   ```
   http://localhost:3000
   ```

### Rodando Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/lfqcamargo/agendamento-reuniao.git
   cd agendamento-reuniao/api
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o arquivo `.env` com suas variáveis de ambiente:**
   ```bash
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/agendamento
   JWT_SECRET=sua_chave_secreta
   ```

4. **Inicie o servidor em modo desenvolvimento:**
   ```bash
   npm run start:dev
   ```

5. **Acesse a API:**
   ```
   http://localhost:3000
   ```

## Scripts Principais

- `npm run start:dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run lint`: Verifica e corrige o código com ESLint.
- `npm run test`: Executa os testes.

## Endpoints Básicos

- **/api/reunioes**:
  - `GET`: Lista todas as reuniões.
  - `POST`: Cria uma nova reunião.
  - `PUT`: Atualiza os detalhes de uma reunião.
  - `DELETE`: Remove uma reunião.

- **/api/participantes**:
  - `GET`: Lista todos os participantes.
  - `POST`: Adiciona um participante a uma reunião.

- **/api/notificacoes**:
  - `POST`: Envia notificações aos participantes.

## Estrutura de Pastas

```
agendamento-reuniao/api/
├── prisma/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
├── test/
├── docker-compose.yml
├── package.json
└── README.md
```

## Tecnologias Usadas

- **Node.js** e **NestJS** para o backend.
- **PostgreSQL** como banco de dados.
- **Prisma ORM** para manipulação de dados.
- **JWT** para autenticação.
- **Vitest** para testes.
