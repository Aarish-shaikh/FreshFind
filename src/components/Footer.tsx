import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageView } from '../types';
import { Sprout, MapPin, Apple, Heart, Mail, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, visitorCount, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    showToast('Subscribed! You will receive weekly harvest notices.', 'success');
    setNewsletterEmail('');
  };

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home Page', page: 'home' },
    { label: 'Find a Market Near You', page: 'directory' },
    { label: 'Fresh Produce Guide', page: 'produce-guide' },
    { label: 'Seasonal Recommendations', page: 'seasonal' },
    { label: 'Saved Basket Bookmarks', page: 'bookmarks' },
    { label: 'About Our Team', page: 'about' },
    { label: 'Contact Us & Hub Location', page: 'contact' },
  ];

  return (
    <footer className="bg-emerald-950 text-stone-300 border-t border-emerald-900 mt-20">
      {/* Upper footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Theme description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-serif">
                  FreshFind
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                  Theme: eGreen Basket
                </span>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed">
              &ldquo;Fresh All Along&rdquo; — Empowering residents and neighborhoods to discover certified farmers markets, support local growers, and relish harvest-fresh nutrition every week.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-800 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Web Innovation Unleashed · 100% Client SPA</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
              Market Explorer
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.slice(0, 4).map(link => (
                <li key={link.page}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="hover:text-emerald-300 transition-colors flex items-center gap-2 focus:outline-none focus-visible:underline"
                  >
                    <span className="text-emerald-600 font-bold">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform & Community */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
              Community & Hub
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.slice(4).map(link => (
                <li key={link.page}>
                  <button
                    onClick={() => navigateTo(link.page)}
                    className="hover:text-emerald-300 transition-colors flex items-center gap-2 focus:outline-none focus-visible:underline"
                  >
                    <span className="text-emerald-600 font-bold">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
              <li className="pt-2 text-xs text-stone-400 flex items-center gap-1.5">
                <span>📍 Metropolis Greenway Hub: 400 Greenways Blvd</span>
              </li>
            </ul>
          </div>

          {/* Simulated visitor counter & newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">
              Live Impact & Community
            </h3>
            
            {/* Real-time simulated visitor counter showcase */}
            <div className="bg-emerald-900/40 p-3.5 rounded-2xl border border-emerald-800/80">
              <span className="text-xs text-emerald-300 font-medium block mb-1">
                Simulated Community Visitors:
              </span>
              <div className="flex items-center gap-1.5">
                {visitorCount.toLocaleString().split('').map((char, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center justify-center font-mono font-bold rounded ${
                      char === ',' 
                        ? 'text-emerald-400 px-0.5 text-base' 
                        : 'bg-emerald-800 text-white px-2 py-1 text-base shadow-inner border border-emerald-700'
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-emerald-400/80 mt-1.5">
                Locals supporting sustainable regional food systems.
              </p>
            </div>

            {/* Newsletter mockup */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <label htmlFor="newsletter" className="text-xs text-stone-300 block">
                Get weekly market schedules &amp; seasonal recipes:
              </label>
              <div className="flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-emerald-900/60 border border-emerald-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 flex-1"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} FreshFind. All rights reserved. Theme: eGreen Basket.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('about')} className="hover:text-emerald-300 transition-colors">
              About Project
            </button>
            <button onClick={() => navigateTo('contact')} className="hover:text-emerald-300 transition-colors">
              Contact & Live Map
            </button>
            <span className="text-emerald-500">Accessible · Responsive SPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
