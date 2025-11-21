import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { FiArrowLeft, FiEdit, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { getStatusColor, getStatusLabel, getContactTypeLabel } from '../utils/statusColors';
import { formatDate, formatDateTime } from '../utils/formatDate';

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'lead',
    notes: '',
  });
  const [contactForm, setContactForm] = useState({
    type: 'telefone',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [reminderForm, setReminderForm] = useState({
    dueDate: '',
    dueTime: '',
    message: '',
  });

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const [clientResponse, remindersResponse] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get('/reminders').catch(() => ({ data: [] })),
      ]);

      setClient(clientResponse.data.client);
      setContacts(clientResponse.data.contacts || []);
      // Filtrar lembretes do cliente atual no frontend
      const allReminders = remindersResponse.data || [];
      const clientReminders = allReminders.filter(r => r.clientId === id);
      setReminders(clientReminders);
      
      if (clientResponse.data.client) {
        const c = clientResponse.data.client;
        setFormData({
          name: c.name || '',
          phone: c.phone || '',
          email: c.email || '',
          status: c.status || 'lead',
          notes: c.notes || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
      alert('Erro ao carregar dados do cliente');
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/clients/${id}`, formData);
      setClient(response.data);
      setIsEditModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao atualizar cliente');
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${contactForm.date}T${contactForm.date.split('T')[1] || '12:00'}`);
      await api.post(`/clients/${id}/contacts`, {
        ...contactForm,
        date: dateTime.toISOString(),
      });
      setIsContactModalOpen(false);
      setContactForm({
        type: 'telefone',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
      loadClientData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao adicionar contato');
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      const dueDate = new Date(`${reminderForm.dueDate}T${reminderForm.dueTime || '12:00'}`);
      await api.post('/reminders', {
        clientId: id,
        dueDate: dueDate.toISOString(),
        message: reminderForm.message,
      });
      setIsReminderModalOpen(false);
      setReminderForm({
        dueDate: '',
        dueTime: '',
        message: '',
      });
      loadClientData();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar lembrete');
    }
  };

  const handleToggleReminder = async (reminderId, currentDone) => {
    try {
      await api.put(`/reminders/${reminderId}`, { done: !currentDone });
      loadClientData();
    } catch (error) {
      alert('Erro ao atualizar lembrete');
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (!window.confirm('Tem certeza que deseja excluir este lembrete?')) return;
    
    try {
      await api.delete(`/reminders/${reminderId}`);
      loadClientData();
    } catch (error) {
      alert('Erro ao excluir lembrete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
        <div className="text-retro-gray-700 font-bold text-xl">CARREGANDO...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
        <p className="text-retro-gray-700 font-bold">CLIENTE NÃO ENCONTRADO</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-retro-gray-50" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
      <div className="mb-6">
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center text-retro-darkBlue hover:text-retro-navy mb-4 font-bold border-2 border-retro-darkBlue px-3 py-1 hover:bg-retro-darkBlue hover:text-retro-white transition-all"
          style={{ fontFamily: 'Courier New, Courier, monospace' }}
        >
          <FiArrowLeft className="mr-2" size={20} />
          ← VOLTAR PARA CLIENTES
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-retro-black mb-2" style={{ textShadow: '2px 2px 0px rgba(13,71,161,0.3)' }}>
              {client.name.toUpperCase()}
            </h1>
            <p className="text-retro-gray-700 font-bold uppercase tracking-wider">DETALHES DO CLIENTE</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center"
          >
            <FiEdit className="mr-2" size={18} />
            EDITAR CLIENTE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <h2 className="text-lg font-bold text-retro-black mb-4 uppercase tracking-wider border-b-2 border-retro-black pb-2">INFORMAÇÕES</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-retro-gray-700 uppercase tracking-wider mb-1">EMAIL</p>
                <p className="text-retro-black font-bold">{client.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-retro-gray-700 uppercase tracking-wider mb-1">TELEFONE</p>
                <p className="text-retro-black font-bold">{client.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-retro-gray-700 uppercase tracking-wider mb-1">STATUS</p>
                <span className={`inline-block px-2 py-1 text-xs font-bold border-2 border-retro-black ${
                  client.status === 'lead' ? 'bg-yellow-400 text-retro-black' :
                  client.status === 'negociando' ? 'bg-retro-blue text-retro-white' :
                  'bg-green-500 text-retro-white'
                }`}>
                  {getStatusLabel(client.status).toUpperCase()}
                </span>
              </div>
              {client.notes && (
                <div>
                  <p className="text-xs font-bold text-retro-gray-700 uppercase tracking-wider mb-1">OBSERVAÇÕES</p>
                  <p className="text-retro-black font-bold whitespace-pre-wrap">{client.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Lembretes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 border-b-2 border-retro-black pb-2">
              <h2 className="text-lg font-bold text-retro-black uppercase tracking-wider">LEMBRETES</h2>
              <Button
                variant="primary"
                onClick={() => setIsReminderModalOpen(true)}
                className="flex items-center text-sm py-1 px-3"
              >
                <FiPlus className="mr-1" size={16} />
                NOVO
              </Button>
            </div>
            
            {reminders.length === 0 ? (
              <p className="text-retro-gray-600 text-sm font-bold">NENHUM LEMBRETE</p>
            ) : (
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div
                    key={reminder._id}
                    className={`p-3 border-2 border-retro-black ${
                      reminder.done ? 'bg-retro-gray-100 border-retro-gray-400' : 'bg-yellow-400 border-retro-black'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${reminder.done ? 'text-retro-gray-600 line-through' : 'text-retro-black'}`}>
                          {reminder.message}
                        </p>
                        <p className="text-xs text-retro-gray-700 mt-1 font-bold">
                          {formatDateTime(reminder.dueDate)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={() => handleToggleReminder(reminder._id, reminder.done)}
                          className={`p-1 border-2 border-retro-black font-bold ${
                            reminder.done
                              ? 'text-green-600 bg-green-100 hover:bg-green-200'
                              : 'text-retro-gray-600 bg-retro-gray-200 hover:bg-retro-gray-300'
                          }`}
                          title={reminder.done ? 'Marcar como pendente' : 'Marcar como concluído'}
                        >
                          <FiCheck size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteReminder(reminder._id)}
                          className="p-1 border-2 border-retro-black text-red-600 bg-red-100 hover:bg-red-200 font-bold"
                          title="Excluir"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Histórico de Interações */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4 border-b-2 border-retro-black pb-2">
              <h2 className="text-lg font-bold text-retro-black uppercase tracking-wider">HISTÓRICO DE INTERAÇÕES</h2>
              <Button
                variant="primary"
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center"
              >
                <FiPlus className="mr-2" size={18} />
                ADICIONAR INTERAÇÃO
              </Button>
            </div>

            {contacts.length === 0 ? (
              <p className="text-retro-gray-600 text-center py-8 font-bold">NENHUMA INTERAÇÃO REGISTRADA</p>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={contact._id} className="border-l-4 border-retro-darkBlue pl-4 py-2 bg-retro-gray-50 border-2 border-retro-black">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-bold text-retro-darkBlue bg-retro-white border-2 border-retro-darkBlue px-2 py-1">
                            {getContactTypeLabel(contact.type).toUpperCase()}
                          </span>
                          <span className="text-xs text-retro-gray-700 font-bold">
                            {formatDateTime(contact.date)}
                          </span>
                        </div>
                        <p className="text-retro-black font-bold whitespace-pre-wrap">{contact.note || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cliente"
        size="md"
      >
        <form onSubmit={handleUpdateClient} className="space-y-4">
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
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              CANCELAR
            </Button>
            <Button variant="primary" type="submit">
              SALVAR
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Adicionar Contato */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Adicionar Interação"
        size="md"
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              TIPO
            </label>
            <select
              value={contactForm.type}
              onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
              className="input-field"
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            >
              <option value="telefone">TELEFONE</option>
              <option value="email">EMAIL</option>
              <option value="visita">VISITA</option>
              <option value="outro">OUTRO</option>
            </select>
          </div>
          <Input
            label="Data"
            type="date"
            value={contactForm.date}
            onChange={(e) => setContactForm({ ...contactForm, date: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              OBSERVAÇÃO
            </label>
            <textarea
              value={contactForm.note}
              onChange={(e) => setContactForm({ ...contactForm, note: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Descreva a interação..."
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t-2 border-retro-black">
            <Button variant="secondary" type="button" onClick={() => setIsContactModalOpen(false)}>
              CANCELAR
            </Button>
            <Button variant="primary" type="submit">
              ADICIONAR
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de Adicionar Lembrete */}
      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        title="Novo Lembrete"
        size="md"
      >
        <form onSubmit={handleAddReminder} className="space-y-4">
          <Input
            label="Data"
            type="date"
            value={reminderForm.dueDate}
            onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
            required
          />
          <Input
            label="Hora"
            type="time"
            value={reminderForm.dueTime}
            onChange={(e) => setReminderForm({ ...reminderForm, dueTime: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-bold text-retro-black mb-2 uppercase tracking-wider" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
              MENSAGEM
            </label>
            <textarea
              value={reminderForm.message}
              onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Descreva o lembrete..."
              required
              style={{ fontFamily: 'Courier New, Courier, monospace' }}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t-2 border-retro-black">
            <Button variant="secondary" type="button" onClick={() => setIsReminderModalOpen(false)}>
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

export default ClientDetails;

