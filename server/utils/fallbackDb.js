import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'fallback.json');

const initFallbackDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('admin123', salt);

    const initialData = {
      users: [
        {
          _id: 'user_admin_thirdai_exec',
          name: 'Third AI Executive',
          email: 'admin@thirdai.com',
          password: hashedPassword,
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      stats: [
        {
          _id: 'stats_default',
          businessesServed: 180,
          commercialsCreated: 540,
          viewsGenerated: '120M+',
          countriesReached: 42,
          createdAt: new Date().toISOString()
        }
      ],
      services: [
        {
          _id: 'srv_1',
          title: 'AI Advertisements',
          description: 'Photorealistic, hyper-engaging AI-generated TV and digital commercials that capture brand identity.',
          icon: 'Sparkles',
          cta: 'Book Commercial',
          order: 1
        },
        {
          _id: 'srv_2',
          title: 'Product Commercials',
          description: 'Cinematic 3D & AI product reveals, macro-detail showcases, and fluid motion product commercials.',
          icon: 'Box',
          cta: 'Showcase Product',
          order: 2
        },
        {
          _id: 'srv_3',
          title: 'Social Media Ads',
          description: 'High-converting viral short-form ads tailored for TikTok, Instagram Reels, and YouTube Shorts.',
          icon: 'Video',
          cta: 'Go Viral',
          order: 3
        },
        {
          _id: 'srv_4',
          title: 'Brand Videos',
          description: 'Emotional, narrative-driven brand films that establish world-class brand prestige in days.',
          icon: 'Film',
          cta: 'Craft Story',
          order: 4
        },
        {
          _id: 'srv_5',
          title: 'AI Video Editing',
          description: 'Automated high-speed precision grading, visual effects enhancement, and audio master tracks.',
          icon: 'Sliders',
          cta: 'Enhance Media',
          order: 5
        },
        {
          _id: 'srv_6',
          title: 'Marketing Creatives',
          description: 'Multi-variant static and dynamic AI creative packages for multi-channel ad campaigns.',
          icon: 'Layers',
          cta: 'Scale Creatives',
          order: 6
        }
      ],
      projects: [
        {
          _id: 'proj_1',
          title: 'Apex Hypercar - Vision 2030',
          description: 'A revolutionary AI commercial introducing the electric hypercar of tomorrow, rendered with photorealistic light transport physics.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
          category: 'Cinematic AI Commercials',
          client: 'Apex Motors Global',
          technology: ['Midjourney v6', 'Sora Engine', 'Runway Gen-2', 'Unreal Engine 5'],
          featured: true,
          liveUrl: 'https://apexmotors.example.com',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'proj_2',
          title: 'Nectar Botanicals - Pure Essence',
          description: 'Luxury skincare commercial showcasing microscopic botanical fusion and glowing skin aura simulation.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
          category: 'Product Animations',
          client: 'Nectar Paris',
          technology: ['Stable Diffusion XL', 'ComfyUI', 'Kling AI', 'DaVinci Resolve'],
          featured: true,
          liveUrl: 'https://nectarparis.example.com',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'proj_3',
          title: 'CyberPulse - Spatial Audio Headphones',
          description: 'Futuristic product commercial depicting audio waves forming tangible neon light architectures.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
          category: 'TV Commercials',
          client: 'CyberPulse Audio',
          technology: ['Luma Dream Machine', 'ElevenLabs Audio', 'Topaz AI'],
          featured: true,
          liveUrl: 'https://cyberpulse.example.com',
          createdAt: new Date().toISOString()
        },
        {
          _id: 'proj_4',
          title: 'Valence Quantum Watch',
          description: 'Temporal precision encapsulated in obsidian ceramic and liquid metal hands.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
          category: 'Product Animations',
          client: 'Valence Horizons',
          technology: ['Pika 1.5', 'Midjourney', 'After Effects 2025'],
          featured: false,
          createdAt: new Date().toISOString()
        }
      ],
      ceos: [
        {
          _id: 'ceo_1',
          name: 'Alexander Vance',
          position: 'Co-Founder & Chief Executive Officer',
          bio: 'Former Hollywood Creative Director and Stanford AI researcher with 12+ years pioneering generative cinema and commercial production.',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
          linkedin: 'https://linkedin.com',
          order: 1
        },
        {
          _id: 'ceo_2',
          name: 'Elena Rostova',
          position: 'Co-Founder & Chief Technology Officer',
          bio: 'Ex-DeepMind Lead Visual Engineer specializing in neural rendering pipelines, real-time light fields, and generative video diffusion models.',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
          linkedin: 'https://linkedin.com',
          order: 2
        }
      ],
      reviews: [
        {
          _id: 'rev_1',
          name: 'Marcus Sterling',
          company: 'CMO, Apex Global',
          rating: 5,
          review: 'Third AI produced a TV commercial for our luxury EV launch in 4 days. The visual quality surpassed $500k legacy studio productions and generated 40M+ impressions in week one.',
          customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          hidden: false
        },
        {
          _id: 'rev_2',
          name: 'Sophia Chen',
          company: 'VP Marketing, Nectar Beauty',
          rating: 5,
          review: 'The precision, lighting, and speed of Third AI are mind-blowing. Their AI pipeline gave us 10 variations of high-converting social ads for a fraction of traditional costs.',
          customerImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
          hidden: false
        },
        {
          _id: 'rev_3',
          name: 'David K. Miller',
          company: 'Founder, CyberPulse Audio',
          rating: 5,
          review: 'Incredible work ethics and unmatched technological prowess. They transformed our product CAD models into hyper-stylized futuristic spots. Truly an unfair advantage.',
          customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
          hidden: false
        }
      ],
      contacts: []
    };
    fs.writeFileSync(FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

const getDB = () => {
  initFallbackDB();
  const content = fs.readFileSync(FILE_PATH, 'utf-8');
  return JSON.parse(content);
};

const saveDB = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

export const fallback = {
  // Projects
  getProjects: (category, featured) => {
    const db = getDB();
    let projs = db.projects || [];
    if (category && category !== 'All') {
      projs = projs.filter(p => p.category === category);
    }
    if (featured === true || featured === 'true') {
      projs = projs.filter(p => p.featured === true);
    }
    return projs;
  },
  getProjectById: (id) => {
    const db = getDB();
    return (db.projects || []).find(p => p._id === id);
  },
  createProject: (data) => {
    const db = getDB();
    const newProject = {
      _id: 'proj_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    if (!db.projects) db.projects = [];
    db.projects.push(newProject);
    saveDB(db);
    return newProject;
  },
  updateProject: (id, data) => {
    const db = getDB();
    if (!db.projects) db.projects = [];
    const index = db.projects.findIndex(p => p._id === id);
    if (index === -1) return null;
    db.projects[index] = {
      ...db.projects[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    saveDB(db);
    return db.projects[index];
  },
  deleteProject: (id) => {
    const db = getDB();
    if (!db.projects) db.projects = [];
    const index = db.projects.findIndex(p => p._id === id);
    if (index === -1) return false;
    db.projects.splice(index, 1);
    saveDB(db);
    return true;
  },

  // Users
  getUserByEmail: (email) => {
    const db = getDB();
    return (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById: (id) => {
    const db = getDB();
    return (db.users || []).find(u => u._id === id);
  },

  // Services
  getServices: () => {
    const db = getDB();
    return (db.services || []).sort((a, b) => a.order - b.order);
  },
  createService: (data) => {
    const db = getDB();
    const newService = {
      _id: 'srv_' + Math.random().toString(36).substr(2, 9),
      ...data
    };
    if (!db.services) db.services = [];
    db.services.push(newService);
    saveDB(db);
    return newService;
  },
  updateService: (id, data) => {
    const db = getDB();
    const index = db.services.findIndex(s => s._id === id);
    if (index === -1) return null;
    db.services[index] = { ...db.services[index], ...data };
    saveDB(db);
    return db.services[index];
  },
  deleteService: (id) => {
    const db = getDB();
    const index = db.services.findIndex(s => s._id === id);
    if (index === -1) return false;
    db.services.splice(index, 1);
    saveDB(db);
    return true;
  },

  // Reviews
  getReviews: () => {
    const db = getDB();
    return db.reviews || [];
  },
  createReview: (data) => {
    const db = getDB();
    const newReview = {
      _id: 'rev_' + Math.random().toString(36).substr(2, 9),
      ...data
    };
    if (!db.reviews) db.reviews = [];
    db.reviews.push(newReview);
    saveDB(db);
    return newReview;
  },
  updateReview: (id, data) => {
    const db = getDB();
    const index = db.reviews.findIndex(r => r._id === id);
    if (index === -1) return null;
    db.reviews[index] = { ...db.reviews[index], ...data };
    saveDB(db);
    return db.reviews[index];
  },
  deleteReview: (id) => {
    const db = getDB();
    const index = db.reviews.findIndex(r => r._id === id);
    if (index === -1) return false;
    db.reviews.splice(index, 1);
    saveDB(db);
    return true;
  },

  // CEOs
  getCEOs: () => {
    const db = getDB();
    return (db.ceos || []).sort((a, b) => a.order - b.order);
  },
  createCEO: (data) => {
    const db = getDB();
    const newCEO = {
      _id: 'ceo_' + Math.random().toString(36).substr(2, 9),
      ...data
    };
    if (!db.ceos) db.ceos = [];
    db.ceos.push(newCEO);
    saveDB(db);
    return newCEO;
  },
  updateCEO: (id, data) => {
    const db = getDB();
    const index = db.ceos.findIndex(c => c._id === id);
    if (index === -1) return null;
    db.ceos[index] = { ...db.ceos[index], ...data };
    saveDB(db);
    return db.ceos[index];
  },
  deleteCEO: (id) => {
    const db = getDB();
    const index = db.ceos.findIndex(c => c._id === id);
    if (index === -1) return false;
    db.ceos.splice(index, 1);
    saveDB(db);
    return true;
  },

  // Stats
  getStats: () => {
    const db = getDB();
    return db.stats && db.stats[0] ? db.stats[0] : {
      businessesServed: 180,
      commercialsCreated: 540,
      viewsGenerated: '120M+',
      countriesReached: 42
    };
  },
  updateStats: (data) => {
    const db = getDB();
    if (!db.stats) db.stats = [];
    if (db.stats.length === 0) {
      db.stats.push({ _id: 'stats_default', ...data });
    } else {
      db.stats[0] = { ...db.stats[0], ...data };
    }
    saveDB(db);
    return db.stats[0];
  },

  // Contacts
  getContacts: () => {
    const db = getDB();
    return db.contacts || [];
  },
  createContact: (data) => {
    const db = getDB();
    const newContact = {
      _id: 'cont_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'unread',
      ...data
    };
    if (!db.contacts) db.contacts = [];
    db.contacts.push(newContact);
    saveDB(db);
    return newContact;
  },
  updateContact: (id, data) => {
    const db = getDB();
    if (!db.contacts) db.contacts = [];
    const index = db.contacts.findIndex(c => c._id === id);
    if (index === -1) return null;
    db.contacts[index] = { ...db.contacts[index], ...data };
    saveDB(db);
    return db.contacts[index];
  },
  deleteContact: (id) => {
    const db = getDB();
    if (!db.contacts) db.contacts = [];
    const index = db.contacts.findIndex(c => c._id === id);
    if (index === -1) return false;
    db.contacts.splice(index, 1);
    saveDB(db);
    return true;
  }
};
