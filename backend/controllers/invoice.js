const invoiceModel = require("../models/invoice");

const getInvoice = async (req, res) => {
    const invoice = await invoiceModel.find();
    res.status(200).json(invoice);
};

const getInvoiceByInvoiceID = async (req, res) => {
    try {
        const { _id } = req.params;
        const invoice = await invoiceModel.find({ _id: _id });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getInvoiceByUserID = async (req, res) => {
    try {
        const { userID } = req.body;
        const invoice = await invoiceModel.find({ userID: userID });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createInvoice = async (req, res) => {
    try {
        const { userID, name, lastName, paymentDate, amount } = req.body;

        const invoice = await invoiceModel.create({
            userID,
            name,
            lastName,
            paymentDate,
            amount,
        });

        res.status(201).json({ invoice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletedInvoice = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedInvoice = await invoiceModel.findByIdAndDelete(id);
        if (!deletedInvoice) {
            res.status(404).json({ message: "Invoice not found" });
        }
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createInvoice, getInvoice, getInvoiceByInvoiceID, getInvoiceByUserID, deletedInvoice };