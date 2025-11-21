import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { FiPlus, FiCheck, FiTrash2, FiClock } from 'react-icons/fi';
import { formatDateTime } from '../utils/formatDate';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPending, setFilterPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    dueDate: '',
    dueTime: '',
    message: '',
  });

  useEffect(() => {
    loadData();
  }, [filterPending]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [remindersResponse, clientsResponse] = await Promise.all([
        api.get(`/reminders${filterPending ? '?pending=true' : ''}`),
        api.get('/clients?limit=1000'),
      ]);

      setReminders(remindersResponse.data || []);
      setClients(clientsResponse.data.items || []);
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dueDate = new Date(`${formData.dueDate}T${formData.dueTime || '12:00'}`);
      await api.post('/reminders', {
        clientId: formData.clientId,
        dueDate: dueDate.toISOString(),
        message: formData.message,
      });
      setIsModalOpen(false);
      setFormData({
        clientId: '',
        dueDate: '',
        dueTime: '',
        message: '',
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar lembrete');
    }
  };

  const handleToggleDone = async (reminderId, currentDone) => {
    try {
      await api.put(`/reminders/${reminderId}`, { done: !currentDone });
      loadData();
    } catch (error) {
      alert('Erro ao atualizar lembrete');
    }
  };

  const handleDelete = async (reminderId) => {
    if (!window.confirm('Tem certeza que deseja excluir este lembrete?')) return;
    
    try {
      await api.delete(`/reminders/${reminderId}`);
      loadData();
    } catch (error) {
      alert('Erro ao excluir lembrete');
    }
  };

  const openModal = () => {
    setFormData({
      clientId: '',
      dueDate: '',
      dueTime: '',
      message: '',
    });
    setIsModalOpen(true);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c._id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
        <div className="text-retro-gray-700 font-bold text-xl">CARREGANDO...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-retro-black mb-2" style={{ textShadow: '2px 2px 0px rgba(13,71,161,0.3)' }}>
            LEMBRETES
          </h1>
          <p className="text-retro-gray-700 font-bold uppercase tracking-wider">GERENCIE SEUS LEMBRETES</p>
        </div>
        <Button
          variant="primary"
          onClick={openModal}
          className="flex items-center"
        >
          <FiPlus className="mr-2" size={18} />
          NOVO LEMBRETE
        </Button>
      </div>

      {/* Filtro */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setFilterPending(!filterPending)}
            className={`px-4 py-2 font-bold border-2 border-retro-black transition-all duration-150 ${
              filterPending
                ? 'bg-retro-darkBlue text-retro-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-retro-gray-200 text-retro-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'
            }`}
            style={{ fontFamily: 'Courier New, Courier, monospace' }}
          >
            {filterPending ? 'MOSTRAR TODOS' : 'APENAS PENDENTES'}
          </button>
        </div>
      </div>

      {/* Lista de Lembretes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reminders.length === 0 ? (
          <div className="col-span-full text-center py-12 text-retro-gray-700 font-bold text-xl">
            NENHUM LEMBRETE ENCONTRADO
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`card ${
                reminder.done ? 'bg-retro-gray-100 border-retro-gray-400' : 'bg-retro-white border-retro-black'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Link
                    to={`/clients/${reminder.clientId}`}
                    className="text-retro-darkBlue hover:text-retro-navy font-bold text-sm mb-2 block border-b-2 border-retro-darkBlue"
                    style={{ fontFamily: 'Courier New, Courier, monospace' }}
                  >
                    {getClientName(reminder.clientId).toUpperCase()}
                  </Link>
                  <p className={`text-retro-black font-bold mb-2 ${
                    reminder.done ? 'line-through text-retro-gray-600' : ''
                  }`}>
                    {reminder.message}
                  </p>
                  <div className="flex items-center text-sm text-retro-gray-700 font-bold">
                    <FiClock className="mr-1" size={14} />
                    {formatDateTime(reminder.dueDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t-2 border-retro-black">
                <button
                  onClick={() => handleToggleDone(reminder._id, reminder.done)}
                  className={`p-2 border-2 border-retro-black font-bold transition-all ${
                    reminder.done
                      ? 'text-green-600 bg-green-100 hover:bg-green-200'
                      : 'text-retro-gray-600 bg-retro-gray-200 hover:bg-retro-gray-300'
                  }`}
                  title={reminder.done ? 'Marcar como pendente' : 'Marcar como concluído'}
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={() => handleDelete(reminder._id)}
                  className="p-2 border-2 border-retro-black text-red-600 bg-red-100 hover:bg-red-200 font-bold transition-all"
                  title="Excluir"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criação */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Lembrete"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              CLIENTE <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className="input-field"
              required
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            >
              <option value="">SELECIONE UM CLIENTE</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Data"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />
          <Input
            label="Hora"
            type="time"
            value={formData.dueTime}
            onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              MENSAGEM <span className="text-red-600">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Descreva o lembrete..."
              required
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t-2 border-retro-black">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              CANCELAR
            </Button>
            <Button variant="primary" type="submit">
              CRIAR LEMBRETE
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reminders;

