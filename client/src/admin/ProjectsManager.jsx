import React, { useState, useEffect } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../services/api';
import { Plus, Trash2, Edit2, Film, Star, Tag, CheckCircle2 } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI Advertisements',
    client: '',
    videoUrl: '',
    thumbnailUrl: '',
    featured: true,
    technology: ''
  });

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const loadProjects = async () => {
    try {
      const res = await fetchProjects();
      if (res.data.success) setProjects(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      category: 'AI Advertisements',
      client: '',
      videoUrl: '',
      thumbnailUrl: '',
      featured: true,
      technology: ''
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setEditingId(p._id);
    setFormData({
      title: p.title || '',
      description: p.description || '',
      category: p.category || 'AI Advertisements',
      client: p.client || '',
      videoUrl: p.videoUrl || '',
      thumbnailUrl: p.thumbnailUrl || '',
      featured: p.featured ?? true,
      technology: Array.isArray(p.technology) ? p.technology.join(', ') : (p.technology || '')
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this commercial project?')) return;
    await deleteProject(id);
    loadProjects();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('client', formData.client);
    data.append('featured', formData.featured);
    data.append('technology', formData.technology);

    if (formData.videoUrl) data.append('videoUrl', formData.videoUrl);
    if (formData.thumbnailUrl) data.append('thumbnailUrl', formData.thumbnailUrl);

    if (videoFile) data.append('video', videoFile);
    if (thumbnailFile) data.append('thumbnail', thumbnailFile);

    if (isEditing) {
      await updateProject(editingId, data);
    } else {
      await createProject(data);
    }

    handleReset();
    loadProjects();
  };

  return (
    <div className="space-y-8">
      {/* Form Container */}
      <div className="glass-panel-heavy p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 shadow-2xl">
        <div className="flex items-center space-x-3">
          <Film className="w-5 h-5 text-brand-red" />
          <h2 className="font-display font-extrabold text-xl text-white">
            {isEditing ? 'Edit Commercial Project' : 'Upload New AI Commercial Spot'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Commercial Title (e.g. Apex Hypercar - Vision 2030)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
            <input
              type="text"
              required
              placeholder="Client / Brand (e.g. Apex Motors Global)"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans bg-brand-surface text-white"
            >
              <option value="AI Advertisements">AI Advertisements</option>
              <option value="Product Commercials">Product Commercials</option>
              <option value="Social Media Ads">Social Media Ads</option>
              <option value="Brand Videos">Brand Videos</option>
            </select>

            <input
              type="text"
              placeholder="Technologies (comma separated: Sora, Runway Gen-3, ElevenLabs)"
              value={formData.technology}
              onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
              className="px-4 py-3 rounded-xl glass-input text-sm font-sans"
            />
          </div>

          {/* Media URL / Upload Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">Video Asset (File or Direct URL)</label>
              <input
                type="url"
                placeholder="Video Direct URL (MP4)"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">Thumbnail Poster (File or Direct URL)</label>
              <input
                type="url"
                placeholder="Image Poster URL (JPEG/PNG)"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white cursor-pointer"
              />
            </div>
          </div>

          <textarea
            required
            rows={3}
            placeholder="Commercial Brief & Storyboard Description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl glass-input text-sm font-sans resize-none"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 accent-brand-red rounded"
            />
            <label htmlFor="featured" className="text-xs font-mono text-gray-300">Feature on Home Page Portfolio</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-mono font-bold text-xs uppercase tracking-wider shadow-red-glow"
            >
              {isEditing ? 'Save Changes' : 'Upload Commercial Project'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-5 rounded-xl glass-panel text-xs font-mono text-gray-400 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((p) => (
          <div key={p._id} className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4">
            <div className="flex gap-4">
              <img
                src={p.thumbnailUrl || 'https://via.placeholder.com/300x180'}
                alt={p.title}
                className="w-32 h-20 rounded-xl object-cover border border-white/15 shrink-0"
              />
              <div className="space-y-1 overflow-hidden">
                <span className="text-[9px] font-mono uppercase font-bold text-brand-red px-2 py-0.5 rounded bg-brand-red/10 border border-brand-red/30 inline-block">
                  {p.category}
                </span>
                <h4 className="font-display font-bold text-white text-base truncate">{p.title}</h4>
                <p className="text-xs text-gray-400 font-mono">{p.client}</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-[10px] font-mono text-gray-400">ID: {p._id.slice(-6)}</span>
              <div className="flex space-x-2">
                <button onClick={() => handleEdit(p)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-brand-red">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg glass-panel text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
