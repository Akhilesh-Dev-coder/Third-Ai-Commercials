import Contact from '../models/Contact.js';
import mongoose from 'mongoose';
import { fallback } from '../utils/fallbackDb.js';

export const getContacts = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      const contacts = fallback.getContacts();
      return res.json({ success: true, count: contacts.length, data: contacts });
    }

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

    if (!process.env.MONGO_URI) {
      const contact = fallback.createContact({ name, email, phone, business, budget, message });
      return res.status(201).json({
        success: true,
        message: 'Inquiry submitted successfully! Our AI production team will contact you shortly.',
        data: contact
      });
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
    if (!process.env.MONGO_URI) {
      const contact = fallback.getContacts().find(c => c._id === req.params.id);
      if (!contact) return res.status(404).json({ success: false, message: 'Inquiry not found' });

      const newStatus = contact.status === 'contacted' ? 'unread' : 'contacted';
      const updatedContact = fallback.updateContact(req.params.id, { status: newStatus });
      return res.json({ success: true, data: updatedContact });
    }

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
    if (!process.env.MONGO_URI) {
      const success = fallback.deleteContact(req.params.id);
      if (!success) return res.status(404).json({ success: false, message: 'Inquiry not found' });
      return res.json({ success: true, message: 'Inquiry deleted successfully' });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
