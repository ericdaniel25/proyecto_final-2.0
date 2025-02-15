const ticketModel = require("../models/tickets");
const postModel = require("../models/posts");
const path = require("path");

const getTickets = async (req, res) => {
  const tickets = await ticketModel.find();
  res.status(200).json(tickets);
};

const getTicketsByTicketID = async (req, res) => {
  try {
    const { _id } = req.params;
    const tickets = await ticketModel.find({ _id: _id });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketsByUserID = async (req, res) => {
  try {
    const { userID } = req.body;
    const tickets = await ticketModel.find({ userID: userID });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketsByTechID = async (req, res) => {
  try {
    const { techID } = req.body;
    const tickets = await ticketModel.find({ techID: techID });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpenTicketsByTechID = async (req, res) => {
  try {
    const { techID } = req.body;
    const tickets = await ticketModel.find({ techID: techID, status: "open" });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingTicketsByTechID = async (req, res) => {
  try {
    const { techID } = req.body;
    const tickets = await ticketModel.find({
      techID: techID,
      status: "pending",
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClosedTicketsByTechID = async (req, res) => {
  try {
    const { techID } = req.body;
    const tickets = await ticketModel.find({
      techID: techID,
      status: "closed",
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { userID, techID, title, description, reportDate, status } = req.body;

    const ticket = await ticketModel.create({
      userID,
      techID,
      title,
      description,
      reportDate,
      status,
    });

    const post = await postModel.create({
      userID,
      ticketID: ticket._id,
    });

    res.status(201).json({ ticket, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadTicketImage = async (req, res) => {
  try {
    const ticketID = req.params.id;
    let image = req.file ? req.file.path : null;

    if (image) {
      image = path.join(
        "../../public/",
        "ticketImages",
        ticketID,
        `${ticketID}${path.extname(req.file.originalname)}`
      );
    }

    const ticket = await ticketModel.findByIdAndUpdate(
      ticketID,
      {
        image,
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket no encontrado" });
    }

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedTicket = await ticketModel.findByIdAndDelete(id);
    if (!deletedTicket) {
      res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.body;

    const ticket = await ticketModel.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.body.userID) ticket.userID = req.body.userID;
    if (req.body.techID) ticket.techID = req.body.techID;
    if (req.body.title) ticket.title = req.body.title;
    if (req.body.description) ticket.description = req.body.description;
    if (req.body.reportDate) ticket.reportDate = req.body.reportDate;
    if (req.body.image) ticket.image = req.body.image;
    if (req.body.status) ticket.status = req.body.status;

    const updatedTicket = await ticket.save();

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTickets,
  createTicket,
  deleteTicket,
  updateTicket,
  getTicketsByTicketID,
  getTicketsByUserID,
  getTicketsByTechID,
  getOpenTicketsByTechID,
  getPendingTicketsByTechID,
  getClosedTicketsByTechID,
  uploadTicketImage,
};
