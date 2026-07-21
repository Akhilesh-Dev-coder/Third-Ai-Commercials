import React, { useState, useEffect } from 'react';
import { fetchCEOs, createCEO, updateCEO, deleteCEO } from '../services/api';
import { Plus, Trash2, Edit2, UserCheck, Users } from 'lucide-react';

export default function CEOManager() {
  const [ceos, setCeos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    linkedin: '',
    order: 1,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const loadCEOs = async () => {
    try {
      const res = await fetchCEOs();
      if (res.data.success) setCeos(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCEOs();
  }, []);

  const handleReset = () => {
    setFormData({ name: '', position: '', bio: '', linkedin: '', order: 1, image: '' });
    setImageFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (c) => {
    setIsEditing(true);
    setEditingId(c._id);
    setFormData({
      name: c.name || '',
      position: c.position || '',
      bio: c.bio || '',
      linkedin: c.linkedin || '',
      order: c.order || 1,
      image: c.image || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete CEO profile?')) return;
    await deleteCEO(id);
    loadCEOs();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('position', formData.position);
    data.append('bio', formData.bio);
    data.append('linkedin', formData.linkedin);
    data.append('order', formData.order);

    if (formData.image) data.append('image', formData.image);
    if (imageFile) data.append('image', imageFile);

    if (isEditing) {
      await updateCEO(editingId, data);
    } else {
      await createCEO(data);
    }
    handleReset();
    loadCEOs();
  };

  return (
    <div className="space-y-8">
      {/* Form Container */}
      <div className="glass-panel-heavy p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-brand-red" />
          <h2 className="font-display font-extrabold text-xl text-white">
            {isEditing ? 'Edit Executive CEO Profile' : 'Add Executive CEO Profile'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Full Name (e.g. Alexander Vance)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
            <input
              type="text"
              required
              placeholder="Position Title (e.g. Co-Founder & CEO)"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="url"
              placeholder="LinkedIn Profile URL"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
            <input
              type="number"
              placeholder="Display Priority Order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="url"
              placeholder="Photo URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-xs font-mono"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="text-xs text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white cursor-pointer"
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="Executive Biography & Background..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans resize-none"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-mono font-bold text-xs uppercase tracking-wider shadow-red-glow"
            >
              {isEditing ? 'Save Profile' : 'Create CEO Card'}
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

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ceos.map((c) => (
          <div key={c._id} className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-4 overflow-hidden">
              <img
                src={c.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop'}
                alt={c.name}
                className="w-14 h-14 rounded-2xl object-cover border border-brand-red/40 shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="font-display font-bold text-white text-base truncate">{c.name}</h4>
                <p className="text-xs text-brand-red font-mono font-semibold">{c.position}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1">{c.bio}</p>
              </div>
            </div>
            <div className="flex space-x-1 shrink-0 ml-3">
              <button onClick={() => handleEdit(c)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-brand-red">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c._id)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
