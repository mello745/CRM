import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { FiUsers, FiTrendingUp, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatDate } from '../utils/formatDate';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalLeads: 0,
    totalNegociando: 0,
    totalClientes: 0,
    pendingReminders: 0,
  });
  const [recentClients, setRecentClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Buscar clientes
      const clientsResponse = await api.get('/clients?limit=1000');
      const clients = clientsResponse.data.items || [];
      
      // Buscar lembretes pendentes
      const remindersResponse = await api.get('/reminders?pending=true');
      const reminders = remindersResponse.data || [];
      
      // Calcular estatísticas
      const totalClients = clients.length;
      const totalLeads = clients.filter(c => c.status === 'lead').length;
      const totalNegociando = clients.filter(c => c.status === 'negociando').length;
      const totalClientes = clients.filter(c => c.status === 'cliente').length;
      
      // Últimos clientes (ordenados por createdAt)
      const recent = [...clients]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setStats({
        totalClients,
        totalLeads,
        totalNegociando,
        totalClientes,
        pendingReminders: reminders.length,
      });
      
      setRecentClients(recent);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Clientes',
      value: stats.totalClients,
      icon: FiUsers,
      color: 'bg-blue-500',
      link: '/clients',
    },
    {
      title: 'Leads',
      value: stats.totalLeads,
      icon: FiTrendingUp,
      color: 'bg-yellow-500',
      link: '/clients?status=lead',
    },
    {
      title: 'Negociando',
      value: stats.totalNegociando,
      icon: FiClock,
      color: 'bg-purple-500',
      link: '/clients?status=negociando',
    },
    {
      title: 'Clientes Fechados',
      value: stats.totalClientes,
      icon: FiCheckCircle,
      color: 'bg-green-500',
      link: '/clients?status=cliente',
    },
    {
      title: 'Lembretes Pendentes',
      value: stats.pendingReminders,
      icon: FiClock,
      color: 'bg-red-500',
      link: '/reminders',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
        <div className="text-retro-gray-700 font-bold text-xl">CARREGANDO...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-retro-black mb-2" style={{ textShadow: '2px 2px 0px rgba(13,71,161,0.3)' }}>
          DASHBOARD
        </h1>
        <p className="text-retro-gray-700 font-bold">VISÃO GERAL DO SEU CRM</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const retroColors = {
            'bg-blue-500': 'bg-retro-darkBlue',
            'bg-yellow-500': 'bg-yellow-500',
            'bg-purple-500': 'bg-retro-blue',
            'bg-green-500': 'bg-green-600',
            'bg-red-500': 'bg-red-600',
          };
          return (
            <Link
              key={index}
              to={stat.link}
              className="card hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-retro-gray-700 mb-1 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-bold text-retro-black">{stat.value}</p>
                </div>
                <div className={`${retroColors[stat.color] || stat.color} p-3 border-2 border-retro-black`}>
                  <Icon className="text-retro-white" size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Últimos Clientes */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 border-b-2 border-retro-black pb-2">
          <h2 className="text-xl font-bold text-retro-black uppercase tracking-wider">ÚLTIMOS CLIENTES ADICIONADOS</h2>
          <Link
            to="/clients"
            className="text-retro-darkBlue hover:text-retro-navy text-sm font-bold border-b-2 border-retro-darkBlue"
            style={{ fontFamily: 'Courier New, Courier, monospace' }}
          >
            VER TODOS →
          </Link>
        </div>

        {recentClients.length === 0 ? (
          <p className="text-retro-gray-600 text-center py-8 font-bold">NENHUM CLIENTE CADASTRADO AINDA</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-2 border-retro-black">
              <thead className="bg-retro-darkBlue text-retro-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-retro-black">
                    NOME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-retro-black">
                    EMAIL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-retro-black">
                    TELEFONE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-retro-black">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    DATA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-retro-white divide-y-2 divide-retro-black">
                {recentClients.map((client) => (
                  <tr key={client._id} className="hover:bg-retro-gray-100 border-b-2 border-retro-black">
                    <td className="px-4 py-3 whitespace-nowrap border-r-2 border-retro-black">
                      <Link
                        to={`/clients/${client._id}`}
                        className="text-retro-darkBlue hover:text-retro-navy font-bold"
                        style={{ fontFamily: 'Courier New, Courier, monospace' }}
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-retro-black font-bold border-r-2 border-retro-black">
                      {client.email || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-retro-black font-bold border-r-2 border-retro-black">
                      {client.phone || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap border-r-2 border-retro-black">
                      <span className={`px-2 py-1 text-xs font-bold border-2 border-retro-black ${
                        client.status === 'lead' ? 'bg-yellow-400 text-retro-black' :
                        client.status === 'negociando' ? 'bg-retro-blue text-retro-white' :
                        'bg-green-500 text-retro-white'
                      }`}>
                        {client.status === 'lead' ? 'LEAD' :
                         client.status === 'negociando' ? 'NEGOCIANDO' :
                         'CLIENTE'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-retro-black font-bold">
                      {formatDate(client.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

