# Guia de Solução de Problemas - Backend

## Problema: Erro ao Registrar Nova Conta

### Possíveis Causas e Soluções

#### 1. **Arquivo .env não existe ou está incompleto**

**Sintoma:** Erro "MONGO_URI não definido" ou "JWT_SECRET não definido"

**Solução:**
1. Crie um arquivo `.env` na raiz do backend (mesmo nível do `package.json`)
2. Adicione as seguintes variáveis:

```env
MONGO_URI=mongodb://localhost:27017/crm_agcell
JWT_SECRET=seu_secret_jwt_super_seguro_aqui_123456
PORT=4000
```

3. Reinicie o servidor

#### 2. **MongoDB não está rodando**

**Sintoma:** Erro "Banco de dados falhou" ou "ECONNREFUSED"

**Solução:**
1. Verifique se o MongoDB está instalado e rodando
2. No Windows, verifique o serviço MongoDB
3. Teste a conexão: `mongodb://localhost:27017/crm_agcell`

#### 3. **Email já cadastrado**

**Sintoma:** Erro "Email já cadastrado"

**Solução:**
- Use um email diferente
- Ou limpe o banco de dados MongoDB

#### 4. **Senha muito curta**

**Sintoma:** Erro "A senha deve ter pelo menos 6 caracteres"

**Solução:**
- Use uma senha com pelo menos 6 caracteres

---

## Como Desabilitar Autenticação Temporariamente

Se você quiser testar o sistema sem precisar fazer login, pode desabilitar a autenticação temporariamente:

### Método 1: Via Variável de Ambiente (Recomendado)

1. Abra o arquivo `.env`
2. Adicione a linha:
```env
DISABLE_AUTH=true
```

3. Reinicie o servidor

** ATENÇÃO:** Isso permite acesso sem token. Use APENAS em desenvolvimento!

### Método 2: Modificar o Middleware

1. Abra `src/middleware/auth.js`
2. Na linha 5, altere para:
```javascript
const DISABLE_AUTH = true; // Forçar desabilitado
```

3. Reinicie o servidor

### Para Reativar a Autenticação

1. Remova `DISABLE_AUTH=true` do `.env` OU defina como `false`
2. OU no middleware, altere para `const DISABLE_AUTH = false;`
3. Reinicie o servidor

---

## Checklist de Verificação

Antes de reportar um erro, verifique:

- [ ] Arquivo `.env` existe na raiz do backend
- [ ] `MONGO_URI` está definido no `.env`
- [ ] `JWT_SECRET` está definido no `.env`
- [ ] MongoDB está rodando
- [ ] Porta 4000 está livre (ou altere PORT no .env)
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor foi reiniciado após alterações

---

## Logs de Erro

O servidor agora mostra mensagens mais detalhadas:

- **Verde:** Sucesso
- **Amarelo:** Avisos
- **Vermelho:** Erros

Verifique o console do servidor para ver mensagens específicas sobre o problema.

---

## Erros Comuns

### "Token não encontrado"
- **Causa:** Requisição sem header Authorization
- **Solução:** Frontend deve enviar token JWT no header

### "Token inválido ou expirado"
- **Causa:** Token expirado (8 horas) ou JWT_SECRET incorreto
- **Solução:** Faça login novamente

### "Erro de configuração do servidor"
- **Causa:** JWT_SECRET não definido
- **Solução:** Adicione JWT_SECRET no .env

### "Banco de dados falhou"
- **Causa:** MongoDB não está rodando ou URI incorreta
- **Solução:** Verifique se MongoDB está rodando e se MONGO_URI está correto

---

## Teste Rápido

Para testar se tudo está funcionando:

1. **Verificar se o servidor inicia:**
```bash
npm run dev
```

2. **Testar registro (via Postman ou curl):**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@teste.com","password":"123456"}'
```

3. **Testar login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@teste.com","password":"123456"}'
```

Se ambos retornarem JSON com token, está funcionando! 



