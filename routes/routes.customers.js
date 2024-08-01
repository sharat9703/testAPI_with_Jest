const express = require('express');
const router = express.Router();
const customerControllers = require('../controllers/controllers.customers');

router.get('/customers',customerControllers.getCustomers);
router.get('/customers/:id',customerControllers.getCustomer);

router.post('/customers',customerControllers.createCustomer);

router.put('/customer/:id',customerControllers.updateCustomer);

router.delete('/customer/:id',customerControllers.deleteCustomer);

module.exports = router;

