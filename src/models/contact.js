const mongoose = require('mongoose');


const ContactSchema = new mongoose.Schema({
clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
date: { type: Date, default: Date.now },
type: { type: String, enum: ['telefone','email','visita','outro'], default: 'telefone' },
note: String,
}, { timestamps: true });


module.exports = mongoose.model('Contact', ContactSchema);

