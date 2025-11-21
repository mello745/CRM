const Client = require('../models/client');
const Contact = require('../models/contact');
const { Parser } = require('json2csv');

// CRIAR CLIENTE
exports.createClient = async (req, res) => {
  try {
    const { name, phone, email, status, notes } = req.body;

    const client = new Client({
      userId: req.user.id,
      name,
      phone,
      email,
      status,
      notes,
    });

    await client.save();

    return res.status(201).json(client);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

// LISTAR CLIENTES (corrigido)
exports.listClients = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user.id };

    if (status) filter.status = status;
    if (q)
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Client.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
      Client.countDocuments(filter),
    ]);

    return res.json({
      items,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

// DETALHES DO CLIENTE
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.user.id });
    if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });

    const contacts = await Contact.find({ clientId: client._id }).sort({ date: -1 });

    return res.json({ client, contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

// ATUALIZAR CLIENTE
exports.updateClient = async (req, res) => {
  try {
    const payload = req.body;

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      payload,
      { new: true }
    );

    if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });

    return res.json(client);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

// DELETAR CLIENTE
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!client) return res.status(404).json({ message: 'Cliente não encontrado' });

    await Contact.deleteMany({ clientId: client._id });

    return res.json({ message: 'Cliente removido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

// ADICIONAR CONTATO / HISTÓRICO
exports.addContact = async (req, res) => {
  try {
    const { type, note, date } = req.body;

    const ContactModel = new Contact({
      clientId: req.params.id,
      userId: req.user.id,
      type,
      note,
      date,
    });

    await ContactModel.save();

    return res.status(201).json(ContactModel);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

// EXPORTAR CSV
exports.exportCSV = async (req, res) => {
  try {
    const filter = { userId: req.user.id };
    const clients = await Client.find(filter).lean();

    const fields = [
      '_id',
      'name',
      'phone',
      'email',
      'status',
      'createdAt',
      'updatedAt'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(clients);

    res.header('Content-Type', 'text/csv');
    res.attachment('clients.csv');

    return res.send(csv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro' });
  }
};

