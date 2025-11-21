const mongoose = require('mongoose');


module.exports = function connectDB(){
  const uri = process.env.MONGO_URI;
  
  if(!uri) {
    const error = 'MONGO_URI não definido em .env';
    console.error('ERRO:', error);
    console.error('   Crie um arquivo .env na raiz do backend com:');
    console.error('   MONGO_URI=mongodb://localhost:27017/crm_agcell');
    throw new Error(error);
  }

  mongoose.connect(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Banco de dados conectado!');
    console.log('   URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Ocultar credenciais
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    console.error('   Verifique se o MongoDB está rodando e se a URI está correta');
    throw err;
  });
};

