const jwt = require('jsonwebtoken');

// AUTENTICAÇÃO DESABILITADA - Para reativar, altere para false
const DISABLE_AUTH = true; // true = desabilitado, false = habilitado

module.exports = function(req, res, next){
  // Se autenticação estiver desabilitada, criar usuário mock para testes
  if(DISABLE_AUTH) {
    console.warn('ATENÇÃO: Autenticação DESABILITADA - Modo de desenvolvimento');
    req.user = { id: '507f1f77bcf86cd799439011', email: 'test@test.com' };
    return next();
  }

  const header = req.header('Authorization');
  if(!header) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  const token = header.replace('Bearer ', '');
  
  if(!process.env.JWT_SECRET) {
    console.error('JWT_SECRET não definido no .env');
    return res.status(500).json({ message: 'Erro de configuração do servidor' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    console.error('Erro na verificação do token:', err.message);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

