const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/remindersController');

router.use(auth);

router.get('/', ctrl.listReminders);
router.post('/', ctrl.createReminder);
router.put('/:id', ctrl.updateReminder);
router.delete('/:id', ctrl.deleteReminder);

module.exports = router;

