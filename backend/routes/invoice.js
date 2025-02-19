const express = require("express");
const router = express.Router();
const {
    getInvoice,
    getInvoiceByInvoiceID,
    getInvoiceByUserID,
    createInvoice,
    deletedInvoice,
} = require("../controllers/invoice");

router.post("/create-invoice", createInvoice);

router.get("/all", getInvoice);
router.get("/:_id", getInvoiceByInvoiceID);
router.get("/user/:_id", getInvoiceByUserID);
router.post("/create-invoice", createInvoice);
router.delete("/:_id", deletedInvoice);

module.exports = router;