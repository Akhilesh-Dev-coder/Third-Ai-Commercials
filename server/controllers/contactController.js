import Contact from '../models/Contact.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, business, budget, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({ name, email, phone, business, budget, message });
    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Our AI production team will contact you shortly.',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

export const markAsContacted = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    contact.status = contact.status === 'contacted' ? 'unread' : 'contacted';
    await contact.save();

    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
