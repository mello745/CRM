const Reminder = require('../models/reminder');

exports.listReminders = async (req, res) => {
  try {
    const { pending } = req.query;
    const filter = { userId: req.user.id };
    if(pending === 'true') filter.done = false;
    const items = await Reminder.find(filter).sort({ dueDate: 1 });
    return res.json(items);
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Erro' }); }
};

exports.createReminder = async (req, res) => {
  try {
    const { clientId, dueDate, message } = req.body;
    const item = new Reminder({ clientId, userId: req.user.id, dueDate, message });
    await item.save();
    return res.status(201).json(item);
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Erro' }); }
};

exports.updateReminder = async (req, res) => {
  try {
    const item = await Reminder.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if(!item) return res.status(404).json({ message: 'Lembrete não encontrado' });
    return res.json(item);
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Erro' }); }
};

exports.deleteReminder = async (req, res) => {
  try {
    const item = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if(!item) return res.status(404).json({ message: 'Lembrete não encontrado' });
    return res.json({ message: 'Removido' });
  } catch (err) { console.error(err); return res.status(500).json({ message: 'Erro' }); }
};

