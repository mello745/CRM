#Guia Rápido de Início - CRM AGCELL Frontend

## Passo a Passo para Executar

### 1. Instalar Dependências

```bash
cd CRM_AGCELL/frontend
npm install
```

### 2. Verificar Configuração do Backend

Certifique-se de que o backend está rodando em `http://localhost:5000`.

Se o backend estiver em outra porta, edite `src/api/axios.js` e altere a `baseURL`.

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

### 4. Fazer Login

- Acesse `http://localhost:3000`
- Faça login com suas credenciais
- Se não tiver conta, registre-se primeiro no backend

## Importante

- O backend deve estar rodando antes de iniciar o frontend
- Certifique-se de que o CORS está habilitado no backend
- O token JWT expira em 8 horas (configuração do backend)

## Solução de Problemas Rápidos

### Erro de Conexão com Backend

1. Verifique se o backend está rodando
2. Verifique a porta do backend (padrão: 5000)
3. Verifique a URL em `src/api/axios.js`

### Erro de CORS

No backend, certifique-se de ter:

```javascript
app.use(cors());
```

### Token Inválido

- Faça logout e login novamente
- Verifique se o token não expirou (8 horas)

## Funcionalidades Disponíveis

Após fazer login, você terá acesso a:

- Dashboard com indicadores
- Gestão completa de clientes
- Histórico de interações
- Sistema de lembretes
- Exportação CSV

---

**Pronto para começar!** 

