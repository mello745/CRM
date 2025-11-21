import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// AUTENTICAÇÃO DESABILITADA - Para reativar, altere para false
const DISABLE_AUTH = true; // true = desabilitado, false = habilitado

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Se autenticação estiver desabilitada, permitir acesso direto
  if (DISABLE_AUTH) {
    return children;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Carregando...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;

