import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchProjects, createProject, updateProject, deleteProject, getPresignedUrl } from '../services/api';
import { Plus, Trash2, Edit2, Film, Star, Tag, CheckCircle2 } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cinematic AI Commercials',
    client: '',
    videoUrl: '',
    featured: true,
    technology: ''
  });

  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false); // Reused for R2 progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

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
      category: 'Cinematic AI Commercials',
      client: '',
      videoUrl: '',
      featured: true,
      technology: ''
    });
    setVideoFile(null);
    setIsEditing(false);
    setEditingId(null);
    setErrorMsg('');
    setUploadProgress(0);
    setUploadingToCloudinary(false);
  };

  const handleEdit = (p) => {
    setIsEditing(true);
    setEditingId(p._id);
    setFormData({
      title: p.title || '',
      description: p.description || '',
      category: p.category || 'Cinematic AI Commercials',
      client: p.client || '',
      videoUrl: p.videoUrl || '',
      featured: p.featured ?? true,
      technology: Array.isArray(p.technology) ? p.technology.join(', ') : (p.technology || '')
    });
    setErrorMsg('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this commercial project?')) return;
    try {
      await deleteProject(id);
      loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete project');
    }
  };

  const uploadToR2Direct = (file) => {
    return new Promise(async (resolve, reject) => {
      let presignedUrl = '';
      let publicUrl = '';

      try {
        const response = await getPresignedUrl({
          fileName: file.name,
          fileType: file.type
        });
        
        if (response.data.success) {
          presignedUrl = response.data.presignedUrl;
          publicUrl = response.data.publicUrl;
        } else {
          return reject(new Error('Failed to generate presigned upload URL from server.'));
        }
      } catch (err) {
        return reject(new Error(err.response?.data?.message || err.message || 'Failed to connect to backend for presigned URL.'));
      }

      setUploadingToCloudinary(true);
      setUploadProgress(0);

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', presignedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      // Track progress
      xhr.upload.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
        setUploadingToCloudinary(false);
        if (xhr.status === 200 || xhr.status === 201) {
          resolve({
            secure_url: publicUrl
          });
        } else {
          reject(new Error(`Storage server responded with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        setUploadingToCloudinary(false);
        reject(new Error('Network error occurred during direct upload to R2. Please check your internet connection or R2 Bucket CORS configuration.'));
      };

      xhr.send(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!videoFile && !formData.videoUrl) {
      setErrorMsg('Please select a video file to upload OR provide a direct video URL.');
      return;
    }

    setSubmitting(true);
    try {
      let finalVideoUrl = formData.videoUrl;

      // Direct Client to Cloudflare R2 Upload
      if (videoFile) {
        const r2Res = await uploadToR2Direct(videoFile);
        finalVideoUrl = r2Res.secure_url;
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('client', formData.client);
      data.append('featured', formData.featured);
      data.append('technology', formData.technology);
      data.append('videoUrl', finalVideoUrl);

      let res;
      if (isEditing) {
        res = await updateProject(editingId, data);
      } else {
        res = await createProject(data);
      }

      if (res.data.success) {
        handleReset();
        loadProjects();
      } else {
        setErrorMsg(res.data.message || 'Failed to upload project.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'Server error occurred during upload.');
    } finally {
      setSubmitting(false);
    }
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
              <option value="Cinematic AI Commercials">Cinematic AI Commercials</option>
              <option value="TV Commercials">TV Commercials</option>
              <option value="Product Animations">Product Animations</option>
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
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-mono font-bold text-gray-400 uppercase block">Video Asset (File or Direct URL)</label>
            <input
              type="url"
              disabled={submitting}
              placeholder="Video Direct URL (e.g. https://res.cloudinary.com/.../video.mp4)"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono disabled:opacity-50"
            />
            <div className="text-[10px] font-mono text-gray-500 py-0.5 text-center">— OR —</div>
            <input
              type="file"
              accept="video/*"
              disabled={submitting}
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-red file:text-white disabled:opacity-50 cursor-pointer"
            />
          </div>

          {uploadingToCloudinary && (
            <div className="space-y-2 pt-3">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-400">
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
                  <span>Uploading directly to Cloudflare R2 (1GB Max)...</span>
                </span>
                <span className="text-brand-red font-extrabold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-brand-red h-full rounded-full transition-all duration-300 shadow-[0_0_15px_#ff2751]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

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

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/30 text-red-400 text-xs font-mono">
              Error: {errorMsg}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 rounded-xl bg-brand-red hover:bg-brand-red-hover disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-mono font-bold text-xs uppercase tracking-wider shadow-red-glow flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading Media...</span>
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Upload Commercial Project'
              )}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="py-3 px-5 rounded-xl glass-panel text-xs font-mono text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                src={p.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop'}
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
