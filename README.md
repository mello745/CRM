# CRM AGCELL - Frontend

Frontend completo do CRM AGCELL desenvolvido com React, Vite, TailwindCSS e integração com backend Node.js/Express.

## Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Integração com Backend](#integração-com-backend)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

## Tecnologias

- **React 18.2.0** - Biblioteca JavaScript para construção de interfaces
- **Vite 5.0.8** - Build tool e dev server
- **React Router DOM 6.20.0** - Roteamento de páginas
- **Context API** - Gerenciamento de estado global (autenticação)
- **Axios 1.6.2** - Cliente HTTP para consumo da API
- **TailwindCSS 3.3.6** - Framework CSS utilitário
- **React Icons 4.12.0** - Biblioteca de ícones

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- Backend do CRM AGCELL rodando e acessível

## Instalação

### 1. Navegue até a pasta do frontend

```bash
cd CRM_AGCELL/frontend
```

### 2. Instale as dependências

```bash
npm install
```

ou

```bash
yarn install
```

## Configuração

### Variáveis de Ambiente

O frontend está configurado para se conectar ao backend na URL `http://localhost:5000/api` por padrão.

Se você precisar alterar a URL do backend, edite o arquivo:

```
src/api/axios.js
```

Altere a propriedade `baseURL`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Altere aqui se necessário
  // ...
});
```

## Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
```

ou

```bash
yarn dev
```

O frontend estará disponível em: `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

## Estrutura do Projeto

```
frontend/
├── public/                 # Arquivos estáticos
├── src/
│   ├── api/
│   │   └── axios.js       # Configuração do Axios com interceptors
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── context/
│   │   └── AuthContext.jsx # Context de autenticação
│   ├── hooks/
│   │   └── useAuth.jsx    # Hook personalizado para autenticação
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Clients.jsx
│   │   ├── ClientDetails.jsx
│   │   └── Reminders.jsx
│   ├── router/
│   │   ├── AppRoutes.jsx  # Configuração de rotas
│   │   └── PrivateRoute.jsx # Componente de rota protegida
│   ├── utils/             # Funções utilitárias
│   │   ├── formatDate.js
│   │   └── statusColors.js
│   ├── App.jsx            # Componente raiz
│   ├── main.jsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Funcionalidades

### Autenticação

- **Login**: Autenticação com email e senha
- **Persistência de Token**: Token JWT salvo no LocalStorage
- **Rotas Protegidas**: Acesso restrito apenas para usuários autenticados
- **Logout**: Limpeza de token e redirecionamento

### Gestão de Clientes

- **Listagem**: Tabela com todos os clientes
- **Busca**: Busca dinâmica por nome, telefone ou email
- **Filtros**: Filtro por status (Lead, Negociando, Cliente)
- **Paginação**: Navegação entre páginas de resultados
- **Criação**: Modal para adicionar novo cliente
- **Edição**: Modal para editar informações do cliente
- **Exclusão**: Remoção de clientes com confirmação
- **Detalhes**: Página dedicada com histórico completo
- **Exportação CSV**: Download de todos os clientes em formato CSV

### 📝 Histórico de Interações

- **Visualização**: Timeline de todas as interações com o cliente
- **Adição**: Formulário para registrar nova interação
- **Tipos**: Suporte para telefone, email, visita e outros
- **Data e Hora**: Registro completo de quando ocorreu a interação

### Lembretes

- **Criação**: Criação de lembretes vinculados a clientes
- **Listagem**: Visualização de todos os lembretes
- **Filtros**: Opção para mostrar apenas pendentes
- **Status**: Marcação de lembretes como concluídos
- **Exclusão**: Remoção de lembretes
- **Integração**: Lembretes visíveis na página de detalhes do cliente

### Dashboard

- **Indicadores**: Cards com estatísticas principais
  - Total de Clientes
  - Total de Leads
  - Total em Negociação
  - Clientes Fechados
  - Lembretes Pendentes
- **Últimos Clientes**: Tabela com os 5 clientes mais recentes
- **Links Rápidos**: Navegação direta para seções específicas

## Integração com Backend

### Endpoints Utilizados

#### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Registro de novo usuário

#### Clientes
- `GET /api/clients` - Listar clientes (com query params: q, status, page, limit)
- `POST /api/clients` - Criar cliente
- `GET /api/clients/:id` - Detalhes do cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Excluir cliente
- `POST /api/clients/:id/contacts` - Adicionar interação
- `GET /api/clients/export/csv` - Exportar CSV

#### Lembretes
- `GET /api/reminders` - Listar lembretes (com query param: pending)
- `POST /api/reminders` - Criar lembrete
- `PUT /api/reminders/:id` - Atualizar lembrete
- `DELETE /api/reminders/:id` - Excluir lembrete

### Interceptors do Axios

O Axios está configurado com interceptors que:

1. **Request Interceptor**: Adiciona automaticamente o token JWT do LocalStorage em todas as requisições
2. **Response Interceptor**: Trata erros 401 (não autorizado) redirecionando para login e limpando o storage

### Formato de Autenticação

Todas as requisições autenticadas incluem o header:

```
Authorization: Bearer <token>
```

## Variáveis de Ambiente

Atualmente, a URL do backend está hardcoded no arquivo `src/api/axios.js`. Para usar variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

2. Atualize `src/api/axios.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // ...
});
```

3. Reinicie o servidor de desenvolvimento.

## Responsividade

O frontend é totalmente responsivo e adapta-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar fixa
- **Tablet**: Sidebar colapsável
- **Mobile**: Menu hambúrguer (pode ser implementado)

## Design

O design segue padrões modernos inspirados em dashboards como Trello, Notion e Monday:

- **Cores**: Paleta suave com tons de cinza, azul e verde
- **Componentes**: Reutilizáveis e consistentes
- **Tipografia**: Clara e legível
- **Espaçamento**: Generoso para melhor legibilidade
- **Interatividade**: Feedback visual em todas as ações

## Segurança

- Tokens JWT armazenados no LocalStorage
- Rotas protegidas com verificação de autenticação
- Interceptors tratam automaticamente tokens expirados
- Validação de formulários no frontend

## Checklist de Funcionalidades

- [x] Login e autenticação com JWT
- [x] Persistência de token no LocalStorage
- [x] Rotas protegidas
- [x] Logout
- [x] Listagem de clientes
- [x] Busca por nome, telefone, email
- [x] Filtros por status
- [x] Paginação
- [x] Criação de clientes
- [x] Edição de clientes
- [x] Exclusão de clientes
- [x] Detalhes do cliente
- [x] Histórico de interações
- [x] Adição de interações
- [x] Criação de lembretes
- [x] Listagem de lembretes
- [x] Filtro de lembretes pendentes
- [x] Marcação de lembretes como concluídos
- [x] Dashboard com indicadores
- [x] Exportação CSV
- [x] Layout responsivo
- [x] Componentes reutilizáveis

## Troubleshooting

### Erro de CORS

Se você encontrar erros de CORS, certifique-se de que o backend está configurado para aceitar requisições do frontend:

```javascript
// No backend (index.js)
app.use(cors());
```

### Token Inválido

Se você receber erros 401, verifique:
1. Se o token está sendo salvo no LocalStorage
2. Se o backend está validando corretamente o token
3. Se o token não expirou (expiração padrão: 8 horas)

### Backend não encontrado

Verifique se:
1. O backend está rodando na porta correta (5000 por padrão)
2. A URL no `axios.js` está correta
3. Não há firewall bloqueando a conexão

## Licença

Este projeto é parte do CRM AGCELL.

## Desenvolvido por Gustavo Corrêa de Mello

Frontend desenvolvido seguindo as especificações do CRM AGCELL.

---

**Versão**: 1.0.0  
**Última atualização**: 2024


