import React, { useState, useEffect } from 'react';
import { fetchReviews, createReview, updateReview, toggleHideReview, deleteReview } from '../services/api';
import { Plus, Trash2, Edit2, Eye, EyeOff, Star, MessageSquare } from 'lucide-react';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    comment: '',
    rating: 5,
    avatar: '',
    hidden: false
  });
  const [avatarFile, setAvatarFile] = useState(null);

  const loadReviews = async () => {
    try {
      const res = await fetchReviews({ showAll: true });
      if (res.data.success) setReviews(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReset = () => {
    setFormData({ name: '', company: '', role: '', comment: '', rating: 5, avatar: '', hidden: false });
    setAvatarFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (r) => {
    setIsEditing(true);
    setEditingId(r._id);
    setFormData({
      name: r.name || '',
      company: r.company || '',
      role: r.role || '',
      comment: r.comment || '',
      rating: r.rating || 5,
      avatar: r.avatar || '',
      hidden: r.hidden || false
    });
  };

  const handleToggleHide = async (id) => {
    await toggleHideReview(id);
    loadReviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review entry?')) return;
    await deleteReview(id);
    loadReviews();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('company', formData.company);
    data.append('role', formData.role);
    data.append('comment', formData.comment);
    data.append('rating', formData.rating);
    data.append('hidden', formData.hidden);

    if (formData.avatar) data.append('avatar', formData.avatar);
    if (avatarFile) data.append('avatar', avatarFile);

    if (isEditing) {
      await updateReview(editingId, data);
    } else {
      await createReview(data);
    }
    handleReset();
    loadReviews();
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="glass-panel-heavy p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-5 h-5 text-brand-red" />
          <h2 className="font-display font-extrabold text-xl text-white">
            {isEditing ? 'Edit Client Testimonial' : 'Add Client Testimonial'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              required
              placeholder="Client Name (e.g. Marcus Vance)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
            <input
              type="text"
              required
              placeholder="Company (e.g. Apex Motors)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
            <input
              type="text"
              placeholder="Title / Role (e.g. CMO)"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans bg-brand-surface text-white"
            >
              <option value="5">5 Stars Rating</option>
              <option value="4">4 Stars Rating</option>
              <option value="3">3 Stars Rating</option>
            </select>

            <input
              type="url"
              placeholder="Avatar Photo URL"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-xs font-mono"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="text-xs text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white cursor-pointer"
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="Client Testimonial Quote..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans resize-none"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-mono font-bold text-xs uppercase tracking-wider shadow-red-glow"
            >
              {isEditing ? 'Save Review' : 'Add Review'}
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
        {reviews.map((r) => (
          <div key={r._id} className="glass-panel p-5 rounded-3xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <img
                src={r.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'}
                alt={r.name}
                className="w-12 h-12 rounded-full object-cover border border-brand-red/40 shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="font-display font-bold text-white text-base truncate">{r.name}</h4>
                <p className="text-xs text-brand-red font-mono font-semibold">{r.company} • {r.role}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1">{r.comment}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 shrink-0 ml-3">
              <button onClick={() => handleToggleHide(r._id)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-brand-red">
                {r.hidden ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
              </button>
              <button onClick={() => handleEdit(r)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-brand-red">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(r._id)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
