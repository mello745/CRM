import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import ClientDetails from '../pages/ClientDetails';
import Reminders from '../pages/Reminders';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// AUTENTICAÇÃO DESABILITADA - Para reativar, altere para false
const DISABLE_AUTH = true; // true = desabilitado, false = habilitado

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {!DISABLE_AUTH && (
          <>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </>
        )}
        
        <Route
          path="/*"
          element={
            DISABLE_AUTH ? (
              // Sem autenticação - acesso direto
              <div className="flex min-h-screen bg-retro-gray-50">
                <Sidebar />
                <div className="flex-1 ml-64">
                  <Navbar />
                  <main className="mt-16">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/clients/:id" element={<ClientDetails />} />
                      <Route path="/reminders" element={<Reminders />} />
                      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/register" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              // Com autenticação - rotas protegidas
              <PrivateRoute>
                <div className="flex min-h-screen bg-retro-gray-50">
                  <Sidebar />
                  <div className="flex-1 ml-64">
                    <Navbar />
                    <main className="mt-16">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/clients/:id" element={<ClientDetails />} />
                        <Route path="/reminders" element={<Reminders />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </PrivateRoute>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

