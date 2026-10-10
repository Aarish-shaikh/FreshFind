import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sprout, Lock, Mail, User, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, showToast } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'warning');
      return;
    }

    if (tab === 'signin') {
      showToast(`Welcome back! Demo session initiated for ${email}.`, 'success');
    } else {
      showToast(`Welcome to eGreen Basket, ${name || 'Neighbor'}! Demo account registered.`, 'success');
    }
    closeAuthModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-emerald-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-emerald-700/80 border border-emerald-500/40 flex items-center justify-center mb-3">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>

          <h2 id="auth-modal-title" className="text-xl font-bold font-serif">
            {tab === 'signin' ? 'Welcome Back to FreshFind' : 'Join the eGreen Basket Circle'}
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1">
            Personalize your weekly market schedule and save local farm notes.
          </p>

          {/* Non-functional disclaimer note */}
          <div className="mt-3 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/50 text-emerald-300 border border-emerald-700">
            UI continuity demo · No actual server credentials stored
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200">
          <button
            type="button"
            onClick={() => setTab('signin')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors ${
              tab === 'signin'
                ? 'text-emerald-800 border-b-2 border-emerald-700 bg-emerald-50/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('signup')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors ${
              tab === 'signup'
                ? 'text-emerald-800 border-b-2 border-emerald-700 bg-emerald-50/50'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@neighborhood.org"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {tab === 'signin' ? 'Sign In to FreshFind' : 'Join eGreen Basket Community'}
          </button>

          {/* Social login mockups */}
          <div className="pt-2 text-center">
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-2 font-medium">
              Or continue with
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Demo Google authentication simulated.', 'info');
                  closeAuthModal();
                }}
                className="py-2 px-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700 flex items-center justify-center gap-2"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Demo Apple ID authentication simulated.', 'info');
                  closeAuthModal();
                }}
                className="py-2 px-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-medium text-stone-700 flex items-center justify-center gap-2"
              >
                <span>Apple</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
