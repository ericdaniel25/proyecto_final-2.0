const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");
const createSession = paymentController.createSession;

router.post('/create-checkout-session', createSession);
router.get('/success', (req, res) => res.redirect('http://localhost:5173/#/profile'));
router.get('/cancel', (req, res) => res.send('https://localhost:5173/#/profile'));

module.exports = router;