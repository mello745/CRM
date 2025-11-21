require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');


const authRoutes = require('./src/routes/auth');
const clientsRoutes = require('./src/routes/clients');
const remindersRoutes = require('./src/routes/reminders');


const app = express();
app.use(cors());
app.use(express.json());


// Verificar variáveis de ambiente essenciais
if(!process.env.MONGO_URI) {
  console.error('⚠️  ERRO: MONGO_URI não definido no arquivo .env');
  console.error('   Crie um arquivo .env na raiz do backend com:');
  console.error('   MONGO_URI=mongodb://localhost:27017/crm_agcell');
}

if(!process.env.JWT_SECRET) {
  console.error('⚠️  ERRO: JWT_SECRET não definido no arquivo .env');
  console.error('   Adicione no .env:');
  console.error('   JWT_SECRET=seu_secret_jwt_aqui');
}

// Verificar se autenticação está desabilitada
if(process.env.DISABLE_AUTH === 'true') {
  console.warn('⚠️  ATENÇÃO: Autenticação DESABILITADA (DISABLE_AUTH=true)');
  console.warn('   Isso permite acesso sem token - USE APENAS EM DESENVOLVIMENTO!');
}

// conectar ao mongo
try {
  connectDB();
} catch (err) {
  console.error('Erro ao conectar ao banco de dados:', err.message);
}


// rotas
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/reminders', remindersRoutes);


app.get('/', (req, res) => res.send('CRM_AGCELL backend OK'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
