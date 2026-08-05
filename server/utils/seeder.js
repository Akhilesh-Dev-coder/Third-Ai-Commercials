import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import CEO from '../models/CEO.js';
import Stats from '../models/Stats.js';
import { connectDB } from '../config/db.js';

dotenv.config();

export const seedInitialData = async () => {
  try {
    console.log('[Seeder] Initializing default seed data...');

    // Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@thirdai.com' });
    if (!adminExists) {
      await User.create({
        name: 'Third AI Executive',
        email: 'admin@thirdai.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('[Seeder] Admin user created: admin@thirdai.com / admin123');
    }

    // Seed Stats
    const statsCount = await Stats.countDocuments();
    if (statsCount === 0) {
      await Stats.create({
        businessesServed: 180,
        commercialsCreated: 540,
        viewsGenerated: '120M+',
        countriesReached: 42
      });
      console.log('[Seeder] Initial stats seeded.');
    }

    // Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany([
        {
          title: 'AI Advertisements',
          description: 'Photorealistic, hyper-engaging AI-generated TV and digital commercials that capture brand identity.',
          icon: 'Sparkles',
          cta: 'Book Commercial',
          order: 1
        },
        {
          title: 'Product Commercials',
          description: 'Cinematic 3D & AI product reveals, macro-detail showcases, and fluid motion product commercials.',
          icon: 'Box',
          cta: 'Showcase Product',
          order: 2
        },
        {
          title: 'Social Media Ads',
          description: 'High-converting viral short-form ads tailored for TikTok, Instagram Reels, and YouTube Shorts.',
          icon: 'Video',
          cta: 'Go Viral',
          order: 3
        },
        {
          title: 'Brand Videos',
          description: 'Emotional, narrative-driven brand films that establish world-class brand prestige in days.',
          icon: 'Film',
          cta: 'Craft Story',
          order: 4
        },
        {
          title: 'AI Video Editing',
          description: 'Automated high-speed precision grading, visual effects enhancement, and audio master tracks.',
          icon: 'Sliders',
          cta: 'Enhance Media',
          order: 5
        },
        {
          title: 'Marketing Creatives',
          description: 'Multi-variant static and dynamic AI creative packages for multi-channel ad campaigns.',
          icon: 'Layers',
          cta: 'Scale Creatives',
          order: 6
        }
      ]);
      console.log('[Seeder] 6 Default Services seeded.');
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: 'Apex Hypercar - Vision 2030',
          description: 'A revolutionary AI commercial introducing the electric hypercar of tomorrow, rendered with photorealistic light transport physics.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
          category: 'Cinematic AI Commercials',
          client: 'Apex Motors Global',
          technology: ['Midjourney v6', 'Sora Engine', 'Runway Gen-2', 'Unreal Engine 5'],
          featured: true,
          liveUrl: 'https://apexmotors.example.com',
          order: 1
        },
        {
          title: 'Nectar Botanicals - Pure Essence',
          description: 'Luxury skincare commercial showcasing microscopic botanical fusion and glowing skin aura simulation.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
          category: 'Product Animations',
          client: 'Nectar Paris',
          technology: ['Stable Diffusion XL', 'ComfyUI', 'Kling AI', 'DaVinci Resolve'],
          featured: true,
          liveUrl: 'https://nectarparis.example.com',
          order: 2
        },
        {
          title: 'CyberPulse - Spatial Audio Headphones',
          description: 'Futuristic product commercial depicting audio waves forming tangible neon light architectures.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop',
          category: 'TV Commercials',
          client: 'CyberPulse Audio',
          technology: ['Luma Dream Machine', 'ElevenLabs Audio', 'Topaz AI'],
          featured: true,
          liveUrl: 'https://cyberpulse.example.com',
          order: 3
        },
        {
          title: 'Valence Quantum Watch',
          description: 'Temporal precision encapsulated in obsidian ceramic and liquid metal hands.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop',
          category: 'Product Animations',
          client: 'Valence Horizons',
          technology: ['Pika 1.5', 'Midjourney', 'After Effects 2025'],
          featured: false,
          order: 4
        }
      ]);
      console.log('[Seeder] Default Projects seeded.');
    }

    // Seed CEOs
    const ceoCount = await CEO.countDocuments();
    if (ceoCount === 0) {
      await CEO.insertMany([
        {
          name: 'Alexander Vance',
          position: 'Co-Founder & Chief Executive Officer',
          bio: 'Former Hollywood Creative Director and Stanford AI researcher with 12+ years pioneering generative cinema and commercial production.',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
          linkedin: 'https://linkedin.com',
          order: 1
        },
        {
          name: 'Elena Rostova',
          position: 'Co-Founder & Chief Technology Officer',
          bio: 'Ex-DeepMind Lead Visual Engineer specializing in neural rendering pipelines, real-time light fields, and generative video diffusion models.',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
          linkedin: 'https://linkedin.com',
          order: 2
        }
      ]);
      console.log('[Seeder] Default CEO profiles seeded.');
    }

    // Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany([
        {
          name: 'Marcus Sterling',
          company: 'CMO, Apex Global',
          rating: 5,
          review: 'Third AI produced a TV commercial for our luxury EV launch in 4 days. The visual quality surpassed $500k legacy studio productions and generated 40M+ impressions in week one.',
          customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
          hidden: false
        },
        {
          name: 'Sophia Chen',
          company: 'VP Marketing, Nectar Beauty',
          rating: 5,
          review: 'The precision, lighting, and speed of Third AI are mind-blowing. Their AI pipeline gave us 10 variations of high-converting social ads for a fraction of traditional costs.',
          customerImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
          hidden: false
        },
        {
          name: 'David K. Miller',
          company: 'Founder, CyberPulse Audio',
          rating: 5,
          review: 'Incredible work ethics and unmatched technological prowess. They transformed our product CAD models into hyper-stylized futuristic spots. Truly an unfair advantage.',
          customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
          hidden: false
        }
      ]);
      console.log('[Seeder] Default Reviews seeded.');
    }

    console.log('[Seeder] All seed data initialized successfully!');
  } catch (err) {
    console.error('[Seeder Error]', err);
  }
};

if (process.argv[2] === '--run') {
  connectDB().then(async () => {
    await seedInitialData();
    process.exit(0);
  });
}
