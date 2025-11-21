import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiDownload } from 'react-icons/fi';
import { getStatusColor, getStatusLabel } from '../utils/statusColors';
import { formatDate } from '../utils/formatDate';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'lead',
    notes: '',
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    setStatusFilter(status);
    setCurrentPage(page);
  }, [searchParams]);

  useEffect(() => {
    loadClients();
  }, [searchTerm, statusFilter, currentPage]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
      };
      
      if (searchTerm) params.q = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await api.get('/clients', { params });
      setClients(response.data.items || []);
      
      const total = response.data.total || 0;
      const limit = response.data.limit || 20;
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSearchParams({ ...Object.fromEntries(searchParams), page: '1' });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    if (status) {
      setSearchParams({ status, page: '1' });
    } else {
      setSearchParams({ page: '1' });
    }
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        email: client.email || '',
        status: client.status || 'lead',
        notes: client.notes || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        phone: '',
        email: '',
        status: 'lead',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient._id}`, formData);
      } else {
        await api.post('/clients', formData);
      }
      closeModal();
      loadClients();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao salvar cliente');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      await api.delete(`/clients/${id}`);
      loadClients();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir cliente');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get('/clients/export/csv', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clients.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Erro ao exportar CSV');
    }
  };

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'lead', label: 'Lead' },
    { value: 'negociando', label: 'Negociando' },
    { value: 'cliente', label: 'Cliente' },
  ];

  return (
    <div className="p-6 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-retro-black mb-2" style={{ textShadow: '2px 2px 0px rgba(13,71,161,0.3)' }}>
            CLIENTES
          </h1>
          <p className="text-retro-gray-700 font-bold uppercase tracking-wider">GERENCIE SEUS CLIENTES</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            className="flex items-center"
          >
            <FiDownload className="mr-2" size={18} />
            EXPORTAR CSV
          </Button>
          <Button
            variant="primary"
            onClick={() => openModal()}
            className="flex items-center"
          >
            <FiPlus className="mr-2" size={18} />
            ADICIONAR CLIENTE
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-retro-gray-600" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por nome, telefone ou email..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex space-x-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusFilter(option.value)}
                className={`px-4 py-2 font-bold border-2 border-retro-black transition-all duration-150 ${
                  statusFilter === option.value
                    ? 'bg-retro-darkBlue text-retro-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-retro-gray-200 text-retro-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
                }`}
                style={{ fontFamily: 'Courier New, Courier, monospace' }}
              >
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8 text-retro-gray-700 font-bold text-xl">CARREGANDO...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-8 text-retro-gray-700 font-bold text-xl">
            NENHUM CLIENTE ENCONTRADO
          </div>
        ) : (
          <>
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
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-retro-black">
                      DATA
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-retro-white divide-y-2 divide-retro-black">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-retro-gray-100 border-b-2 border-retro-black">
                      <td className="px-4 py-3 whitespace-nowrap font-bold text-retro-black border-r-2 border-retro-black">
                        {client.name}
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
                          {getStatusLabel(client.status).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-retro-black font-bold border-r-2 border-retro-black">
                        {formatDate(client.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/clients/${client._id}`)}
                            className="text-retro-darkBlue hover:text-retro-navy border-2 border-retro-darkBlue px-2 py-1 hover:bg-retro-darkBlue hover:text-retro-white transition-all font-bold"
                            title="Ver detalhes"
                            style={{ fontFamily: 'Courier New, Courier, monospace' }}
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => openModal(client)}
                            className="text-retro-blue hover:text-retro-navy border-2 border-retro-blue px-2 py-1 hover:bg-retro-blue hover:text-retro-white transition-all font-bold"
                            title="Editar"
                            style={{ fontFamily: 'Courier New, Courier, monospace' }}
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="text-red-600 hover:text-retro-white border-2 border-red-600 px-2 py-1 hover:bg-red-600 transition-all font-bold"
                            title="Excluir"
                            style={{ fontFamily: 'Courier New, Courier, monospace' }}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-retro-black">
                <div className="text-sm text-retro-black font-bold" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                  PÁGINA {currentPage} DE {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const newPage = Math.max(1, currentPage - 1);
                      setCurrentPage(newPage);
                      setSearchParams({ ...Object.fromEntries(searchParams), page: newPage.toString() });
                    }}
                    disabled={currentPage === 1}
                  >
                    ANTERIOR
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const newPage = Math.min(totalPages, currentPage + 1);
                      setCurrentPage(newPage);
                      setSearchParams({ ...Object.fromEntries(searchParams), page: newPage.toString() });
                    }}
                    disabled={currentPage === totalPages}
                  >
                    PRÓXIMA
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingClient ? 'Editar Cliente' : 'Adicionar Cliente'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              STATUS
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            >
              <option value="lead">LEAD</option>
              <option value="negociando">NEGOCIANDO</option>
              <option value="cliente">CLIENTE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              OBSERVAÇÕES
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="input-field"
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t-2 border-retro-black">
            <Button variant="secondary" type="button" onClick={closeModal}>
              CANCELAR
            </Button>
            <Button variant="primary" type="submit">
              {editingClient ? 'SALVAR' : 'CRIAR'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;

