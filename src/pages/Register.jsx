import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-darkBlue px-4" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <div className="max-w-md w-full bg-retro-white border-4 border-retro-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="text-center mb-8 border-b-4 border-retro-black pb-4">
          <h1 className="text-4xl font-bold text-retro-black mb-2" style={{ textShadow: '4px 4px 0px rgba(13,71,161,0.3)' }}>
            CRM AGCELL
          </h1>
          <p className="text-retro-gray-700 font-bold uppercase tracking-wider">CRIE SUA CONTA PARA COMEÇAR</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 border-4 border-retro-black text-retro-white px-4 py-3 font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider">
              NOME COMPLETO
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-gray-600" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-10"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider">
              EMAIL
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-gray-600" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider">
              SENHA
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-gray-600" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider">
              CONFIRMAR SENHA
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-gray-600" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="Digite a senha novamente"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
          </Button>
        </form>

        <div className="mt-6 text-center border-t-2 border-retro-black pt-4">
          <p className="text-sm text-retro-gray-700 font-bold">
            JÁ TEM UMA CONTA?{' '}
            <Link to="/login" className="text-retro-darkBlue hover:text-retro-navy font-bold border-b-2 border-retro-darkBlue">
              FAÇA LOGIN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

