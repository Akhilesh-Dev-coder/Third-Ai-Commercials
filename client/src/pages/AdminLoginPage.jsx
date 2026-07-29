import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, Key } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden bg-neural-grid">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel-heavy rounded-3xl p-8 sm:p-10 border border-white/15 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-red via-red-600 to-amber-500 flex items-center justify-center mx-auto shadow-red-glow mb-2">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="font-display font-black text-2xl text-white tracking-tight">
            CMS Admin Portal
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Secure Neural Authentication Terminal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand-red" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl glass-input text-sm font-sans"
              placeholder="admin@thirdai.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-brand-red" /> Security Key / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl glass-input text-sm font-sans"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-brand-red/50 text-red-200 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest text-white shimmer-btn shadow-red-glow transition-all flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Authenticating Terminal...</span>
            ) : (
              <>
                <span>Access CMS Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/10">
          <Link to="/" className="text-xs text-gray-400 hover:text-brand-red transition font-mono">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
