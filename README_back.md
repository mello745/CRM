# CRM AGCELL - Backend

Backend do CRM AGCELL desenvolvido com Node.js, Express e MongoDB.

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Configuração de conexão com MongoDB
│   ├── controllers/
│   │   ├── authController.js    # Controllers de autenticação
│   │   ├── clientsController.js # Controllers de clientes
│   │   └── remindersController.js # Controllers de lembretes
│   ├── middleware/
│   │   └── auth.js             # Middleware de autenticação JWT
│   ├── models/
│   │   ├── user.js             # Modelo de Usuário
│   │   ├── client.js           # Modelo de Cliente
│   │   ├── contact.js          # Modelo de Contato/Interação
│   │   └── reminder.js         # Modelo de Lembrete
│   └── routes/
│       ├── auth.js             # Rotas de autenticação
│       ├── clients.js          # Rotas de clientes
│       └── reminders.js        # Rotas de lembretes
├── index.js                    # Arquivo principal da aplicação
├── package.json                # Dependências e scripts
└── .env                        # Variáveis de ambiente (não versionado)
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com:

```env
MONGO_URI=mongodb://localhost:27017/crm_agcell
JWT_SECRET=seu_secret_jwt_aqui
PORT=4000
```

### 3. Iniciar o Servidor

```bash
npm run dev
```

ou

```bash
npm start
```

O servidor estará rodando em `http://localhost:4000`

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário

### Clientes
- `GET /api/clients` - Listar clientes (query params: q, status, page, limit)
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Detalhes do cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Excluir cliente
- `POST /api/clients/:id/contacts` - Adicionar interação
- `GET /api/clients/export/csv` - Exportar CSV

### Lembretes
- `GET /api/reminders` - Listar lembretes (query param: pending)
- `POST /api/reminders` - Criar lembrete
- `PUT /api/reminders/:id` - Atualizar lembrete
- `DELETE /api/reminders/:id` - Excluir lembrete

## 🔒 Autenticação

Todas as rotas (exceto `/api/auth/*`) requerem autenticação via JWT.

Envie o token no header:
```
Authorization: Bearer <token>
```

## 🛠 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **json2csv** - Exportação CSV

## 📝 Notas

- O token JWT expira em 8 horas
- Todos os dados são isolados por usuário (userId)
- O servidor usa CORS habilitado para permitir requisições do frontend

