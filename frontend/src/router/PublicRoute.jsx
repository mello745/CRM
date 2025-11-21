import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;

