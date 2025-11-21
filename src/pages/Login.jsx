import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
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
          <p className="text-retro-gray-700 font-bold uppercase tracking-wider">FAÇA LOGIN PARA CONTINUAR</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 border-4 border-retro-black text-retro-white px-4 py-3 font-bold">
              {error}
            </div>
          )}

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
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </Button>
        </form>

        <div className="mt-6 text-center border-t-2 border-retro-black pt-4">
          <p className="text-sm text-retro-gray-700 font-bold">
            NÃO TEM UMA CONTA?{' '}
            <Link to="/register" className="text-retro-darkBlue hover:text-retro-navy font-bold border-b-2 border-retro-darkBlue">
              CRIAR CONTA
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

