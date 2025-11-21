const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/clientsController');

router.use(auth);

router.get('/', ctrl.listClients);
router.post('/', ctrl.createClient);
router.get('/export/csv', ctrl.exportCSV);
router.get('/:id', ctrl.getClient);
router.put('/:id', ctrl.updateClient);
router.delete('/:id', ctrl.deleteClient);
router.post('/:id/contacts', ctrl.addContact);

module.exports = router;

