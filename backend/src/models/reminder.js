const mongoose = require('mongoose');


const ReminderSchema = new mongoose.Schema({
clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
dueDate: { type: Date, required: true },
message: { type: String, required: true },
done: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('Reminder', ReminderSchema);

