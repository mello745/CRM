const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validações
    if(!name || !email || !password) {
      return res.status(400).json({ message: 'Dados incompletos' });
    }

    if(password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se email já existe
    const existing = await User.findOne({ email });
    if(existing) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Criar usuário
    const user = new User({ name, email, passwordHash });
    await user.save();

    // Gerar token
    if(!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido no .env');
      return res.status(500).json({ message: 'Erro de configuração do servidor' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    return res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    
    // Tratamento de erros específicos
    if(err.code === 11000) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    
    if(err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dados inválidos: ' + Object.values(err.errors).map(e => e.message).join(', ') });
    }
    
    return res.status(500).json({ 
      message: 'Erro no servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validações
    if(!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha
    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    // Gerar token
    if(!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido no .env');
      return res.status(500).json({ message: 'Erro de configuração do servidor' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    return res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ 
      message: 'Erro no servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

