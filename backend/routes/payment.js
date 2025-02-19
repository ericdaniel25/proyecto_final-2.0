const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");
const invoiceController = require("../controllers/invoice");
const createSession = paymentController.createSession;
const createInvoice = invoiceController.createInvoice;

router.post('/create-checkout-session', createSession);
router.post('/success', createInvoice, (req, res) => res.redirect('https://localhost:5173/#/profile'));
router.get('/cancel', (req, res) => res.send('https://localhost:5173/#/profile'));

module.exports = router;