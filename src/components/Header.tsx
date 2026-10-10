import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageView } from '../types';
import { 
  Sprout, 
  MapPin, 
  Apple, 
  Sparkles, 
  Heart, 
  Clock, 
  Menu, 
  X, 
  User, 
  Compass, 
  Info, 
  Mail,
  Users
} from 'lucide-react';
import { getCurrentDayName } from '../utils/schedule';

export const Header: React.FC = () => {
  const { 
    currentPage, 
    navigateTo, 
    bookmarks, 
    currentTime, 
    visitorCount, 
    openAuthModal,
    userLocation
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageView; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', page: 'home', icon: Sprout },
    { label: 'Find a Market', page: 'directory', icon: MapPin },
    { label: 'Produce Guide', page: 'produce-guide', icon: Apple },
    { label: 'Seasonal Picks', page: 'seasonal', icon: Sparkles },
    { label: 'About Us', page: 'about', icon: Info },
    { label: 'Contact Us', page: 'contact', icon: Mail },
  ];

  const handleNavClick = (page: PageView) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDay = getCurrentDayName(currentTime);
  const formattedDate = currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-xs transition-all">
      {/* Top micro announcement banner: Live clock & simulated visitor counter */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Real-time Clock display */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDay}, {formattedDate} · {formattedTime}</span>
            </span>
            <span className="hidden md:inline text-emerald-600">|</span>
            <span className="hidden md:inline text-emerald-200/80">
              Live Market Hours Active
            </span>
          </div>

          {/* Visitor Counter & Geolocation status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-200/90">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Community Visits:</span>
              <span className="font-mono font-semibold tracking-wider text-white bg-emerald-900/80 px-1.5 py-0.5 rounded text-[10px] border border-emerald-800">
                {visitorCount.toLocaleString()}
              </span>
            </div>
            {userLocation && (
              <span className="hidden lg:inline text-emerald-300 text-[11px]">
                📍 Live GPS Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Tagline */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1 -ml-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif">
                  FreshFind
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                  eGreen Basket
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium -mt-0.5">
                Fresh All Along · Local Farmers Markets
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map(link => {
              const isActive = currentPage === link.page || 
                (link.page === 'directory' && currentPage === 'market-detail');
              const Icon = link.icon;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isActive
                      ? 'bg-emerald-100/70 text-emerald-900 shadow-xs'
                      : 'text-stone-700 hover:text-emerald-800 hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bookmarks Basket Button */}
            <button
              onClick={() => handleNavClick('bookmarks')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                currentPage === 'bookmarks'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100/80 border border-emerald-200/60'
              }`}
              title="Saved Basket"
            >
              <Heart className={`w-4 h-4 ${currentPage === 'bookmarks' ? 'fill-current text-white' : 'text-emerald-700 fill-emerald-100'}`} />
              <span className="hidden sm:inline font-semibold">Saved Basket</span>
              {bookmarks.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-xs font-bold ${
                  currentPage === 'bookmarks' 
                    ? 'bg-white text-emerald-900' 
                    : 'bg-emerald-700 text-white'
                }`}>
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Non-functional Dummy Login/Signup Buttons (SRS Spec requirement) */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-stone-200 pl-3 ml-1">
              <button
                onClick={() => openAuthModal('signin')}
                className="px-3 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Join Free</span>
              </button>
            </div>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-stone-700 hover:text-emerald-900 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-100">
            {navLinks.map(link => {
              const isActive = currentPage === link.page;
              const Icon = link.icon;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-stone-50 text-stone-700 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('signin');
              }}
              className="w-full py-2.5 text-sm font-semibold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
            >
              Sign In (Demo Account)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('signup');
              }}
              className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-4 h-4" />
              <span>Create eGreen Basket Profile</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
