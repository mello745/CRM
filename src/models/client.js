const mongoose = require('mongoose');


const ClientSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
name: { type: String, required: true },
phone: String,
email: String,
status: { type: String, enum: ['lead','negociando','cliente'], default: 'lead' },
notes: String,
}, { timestamps: true });


module.exports = mongoose.model('Client', ClientSchema);

