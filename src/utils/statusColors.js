export const getStatusColor = (status) => {
  const colors = {
    lead: 'bg-yellow-100 text-yellow-800',
    negociando: 'bg-blue-100 text-blue-800',
    cliente: 'bg-green-100 text-green-800',
    perdido: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusLabel = (status) => {
  const labels = {
    lead: 'Lead',
    negociando: 'Negociando',
    cliente: 'Cliente',
    perdido: 'Perdido',
  };
  return labels[status] || status;
};

export const getContactTypeLabel = (type) => {
  const labels = {
    telefone: 'Telefone',
    email: 'Email',
    visita: 'Visita',
    outro: 'Outro',
  };
  return labels[type] || type;
};

