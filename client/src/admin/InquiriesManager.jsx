import React, { useState, useEffect } from 'react';
import { fetchContacts, updateContactStatus, deleteContact } from '../services/api';
import { Inbox, Trash2, CheckCircle2, Clock, Mail, Phone, Building, DollarSign } from 'lucide-react';

export default function InquiriesManager() {
  const [contacts, setContacts] = useState([]);

  const loadContacts = async () => {
    try {
      const res = await fetchContacts();
      if (res.data.success) setContacts(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleToggleStatus = async (id) => {
    await updateContactStatus(id);
    loadContacts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete contact inquiry?')) return;
    await deleteContact(id);
    loadContacts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <Inbox className="w-6 h-6 text-brand-red" />
          <div>
            <h2 className="font-display font-extrabold text-2xl text-white">Client Inquiry Submissions</h2>
            <p className="text-xs text-gray-400 font-mono">Incoming project briefs and strategy call requests</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-white px-3 py-1 rounded-full bg-brand-red shadow-red-glow">
          {contacts.length} Total Inquiries
        </span>
      </div>

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-gray-400 font-mono text-xs">
            No client inquiries received yet.
          </div>
        ) : (
          contacts.map((c) => (
            <div
              key={c._id}
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                c.status === 'new'
                  ? 'border-brand-red/60 shadow-red-glow bg-brand-red/5'
                  : 'border-white/10 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-display font-bold text-lg text-white">{c.name}</h3>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        c.status === 'new'
                          ? 'bg-red-950/60 text-brand-red border-brand-red/40'
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {c.status === 'new' ? 'New Brief' : 'Contacted'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-brand-red" /> {c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-brand-red" /> {c.phone}</span>}
                    {c.company && <span className="flex items-center gap-1"><Building className="w-3 h-3 text-brand-red" /> {c.company}</span>}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(c._id)}
                    className="px-3 py-1.5 rounded-xl glass-panel text-xs font-mono font-bold text-gray-300 hover:text-white border border-white/15 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{c.status === 'new' ? 'Mark Contacted' : 'Mark New'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-2 rounded-xl glass-panel text-gray-400 hover:text-red-500 border border-white/15"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inquiry Meta Pills */}
              <div className="flex flex-wrap gap-2 mb-3 font-mono text-[10px]">
                {c.service && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10">
                    Capability: {c.service}
                  </span>
                )}
                {c.budget && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-red/10 text-brand-red border border-brand-red/30">
                    Budget: {c.budget}
                  </span>
                )}
              </div>

              {/* Message Content */}
              {c.message && (
                <p className="text-xs text-gray-300 leading-relaxed font-light bg-black/40 p-3.5 rounded-2xl border border-white/5">
                  "{c.message}"
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
