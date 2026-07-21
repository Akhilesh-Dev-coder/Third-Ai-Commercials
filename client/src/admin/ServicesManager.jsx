import React, { useState, useEffect } from 'react';
import { fetchServices, createService, updateService, deleteService } from '../services/api';
import { Plus, Trash2, Edit2, Sparkles, Tag, Sliders } from 'lucide-react';

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Sparkles',
    cta: 'Book Commercial',
    tag: 'Core Engine'
  });

  const loadServices = async () => {
    try {
      const res = await fetchServices();
      if (res.data.success) setServices(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleReset = () => {
    setFormData({ title: '', description: '', icon: 'Sparkles', cta: 'Book Commercial', tag: 'Core Engine' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (s) => {
    setIsEditing(true);
    setEditingId(s._id);
    setFormData({
      title: s.title || '',
      description: s.description || '',
      icon: s.icon || 'Sparkles',
      cta: s.cta || 'Book Commercial',
      tag: s.tag || 'Core Engine'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete service entry?')) return;
    await deleteService(id);
    loadServices();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateService(editingId, formData);
    } else {
      await createService(formData);
    }
    handleReset();
    loadServices();
  };

  return (
    <div className="space-y-8">
      {/* Form Container */}
      <div className="glass-panel-heavy p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-brand-red" />
          <h2 className="font-display font-extrabold text-xl text-white">
            {isEditing ? 'Edit Agency Capability Service' : 'Add Agency Capability Service'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Service Title (e.g. AI Broadcast Commercials)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
            <input
              type="text"
              placeholder="Tag Badge (e.g. Core Engine, Luxury 3D)"
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans bg-brand-surface text-white"
            >
              <option value="Sparkles">Sparkles (AI Neural)</option>
              <option value="Box">Box (3D Product)</option>
              <option value="Video">Video (Social Media)</option>
              <option value="Film">Film (Brand Film)</option>
              <option value="Sliders">Sliders (AI VFX & Audio)</option>
              <option value="Layers">Layers (Omnichannel Creatives)</option>
            </select>

            <input
              type="text"
              placeholder="Button CTA Label (e.g. Book Commercial)"
              value={formData.cta}
              onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="Service Description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans resize-none"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-mono font-bold text-xs uppercase tracking-wider shadow-red-glow"
            >
              {isEditing ? 'Save Service' : 'Add Service'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl glass-panel text-xs font-mono text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s._id} className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold text-brand-red uppercase px-2 py-0.5 rounded bg-brand-red/10 border border-brand-red/30">
                {s.tag || 'Service'}
              </span>
              <h4 className="font-display font-bold text-white text-base">{s.title}</h4>
              <p className="text-xs text-gray-400 font-light line-clamp-2">{s.description}</p>
            </div>
            <div className="flex space-x-2 shrink-0 ml-4">
              <button onClick={() => handleEdit(s)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-brand-red">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(s._id)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
