import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Apple, 
  Clock, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  ChevronRight,
  TrendingUp,
  Compass
} from 'lucide-react';
import { getMarketOpenStatus, getCurrentDayName, getCurrentSeason } from '../utils/schedule';
import { calculateDistanceMiles, formatDistance } from '../utils/geolocation';
import { DayOfWeek, ProduceCategory } from '../types';

export const HomeView: React.FC = () => {
  const { 
    markets, 
    produceList, 
    currentTime, 
    userLocation, 
    requestUserLocation, 
    isLocating, 
    navigateTo, 
    toggleBookmark, 
    isBookmarked,
    visitorCount
  } = useApp();

  // Quick Find local state
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const areas = Array.from(new Set(markets.map(m => m.area)));
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories: ProduceCategory[] = [
    'Vegetables',
    'Fruits',
    'Herbs & Greens',
    'Dairy & Eggs',
    'Artisanal & Bakery',
    'Honey & Preserves'
  ];

  const handleQuickFindSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('directory', {
      area: selectedArea,
      day: selectedDay,
      category: selectedCategory
    });
  };

  const currentSeason = getCurrentSeason(currentTime);
  const currentDayName = getCurrentDayName(currentTime);

  // Markets currently open or opening next
  const openMarkets = markets.filter(m => getMarketOpenStatus(m, currentTime).isOpenNow);
  const featuredMarkets = markets.filter(m => m.isFeatured);

  // This week's seasonal picks
  const seasonalPicks = produceList.filter(p => p.season.includes(currentSeason) || p.season.includes('Year-Round')).slice(0, 4);

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-emerald-100/60 via-emerald-50/40 to-transparent rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Introduction */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-200/70 border border-emerald-300 text-emerald-900 text-xs font-semibold tracking-wide shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                <span>eGreen Basket · Sustainable Community Agriculture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 font-serif tracking-tight leading-[1.12]">
                Fresh All Along, <br />
                <span className="text-emerald-800">Straight From The Soil.</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                No more scattered flyers or outdated schedules. Discover certified farmers markets near you, explore peak seasonal harvests, check live open hours, and plan your weekly basket with confidence.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigateTo('directory')}
                  className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-900/15 flex items-center gap-2 transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
                >
                  <MapPin className="w-4 h-4 text-emerald-200" />
                  <span>Explore All Markets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigateTo('seasonal')}
                  className="px-5 py-3.5 bg-white hover:bg-emerald-50/80 text-emerald-900 font-semibold rounded-2xl border border-emerald-200/80 shadow-xs flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>What&apos;s in Season Now</span>
                </button>
              </div>

              {/* Live Info Micro-strip */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-500">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-Time Hours Active</span>
                </div>
                <span>•</span>
                <div>
                  Today is <span className="font-semibold text-stone-800">{currentDayName}</span>
                </div>
                <span>•</span>
                <div>
                  Season: <span className="font-semibold text-stone-800">{currentSeason} Harvest</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-20 transform -rotate-1" />
                
                <div className="relative bg-white rounded-3xl p-5 shadow-xl border border-emerald-100">
                  <img
                    src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80"
                    alt="Bountiful local farmers market stall"
                    className="w-full h-64 object-cover rounded-2xl shadow-inner"
                  />
                  
                  {/* Floating badge on hero card */}
                  <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-100 shadow-md flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-950">
                      {openMarkets.length > 0 ? `${openMarkets.length} Markets Open Today` : 'Weekend Markets Active'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-semibold text-stone-800">
                      Metropolis Regional Network
                    </span>
                    <span className="text-emerald-700 font-medium">
                      60+ Family Growers Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Prominent 'Find a Market Near You' Quick Find Prompt (SRS Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100/90">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wider uppercase">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Quick Find Prompt</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-0.5">
                Find a Farmers Market Near You
              </h2>
            </div>

            {/* Geolocation Quick Trigger */}
            <button
              onClick={requestUserLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0"
            >
              <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin text-emerald-600' : 'text-emerald-700'}`} />
              <span>{userLocation ? 'GPS Calibrated · Click to Recalibrate' : 'Use My Live GPS Location'}</span>
            </button>
          </div>

          <form onSubmit={handleQuickFindSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filter by Area / Neighborhood */}
            <div>
              <label htmlFor="quick-area" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Area / Neighborhood</span>
              </label>
              <select
                id="quick-area"
                value={selectedArea}
                onChange={e => setSelectedArea(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="all">All Neighborhoods</option>
                {areas.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Filter by Day of the Week */}
            <div>
              <label htmlFor="quick-day" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Day of the Week</span>
              </label>
              <select
                id="quick-day"
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="all">Any Operating Day</option>
                {days.map(d => (
                  <option key={d} value={d}>
                    {d} {d === currentDayName ? '(Today)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Produce Type */}
            <div>
              <label htmlFor="quick-category" className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Apple className="w-3.5 h-3.5 text-emerald-700" />
                <span>Produce Category</span>
              </label>
              <select
                id="quick-category"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="all">All Fresh Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Search className="w-4 h-4" />
                <span>Search Markets</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured / Currently Open Markets Showcase (SRS Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Live Schedule Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mt-1">
              Featured &amp; Active Markets
            </h2>
          </div>

          <button
            onClick={() => navigateTo('directory')}
            className="text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
          >
            <span>View All {markets.length} Markets</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Markets Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMarkets.slice(0, 3).map(market => {
            const status = getMarketOpenStatus(market, currentTime);
            const bookmarked = isBookmarked('market', market.id);
            const distance = userLocation ? calculateDistanceMiles(
              userLocation.latitude,
              userLocation.longitude,
              market.latitude,
              market.longitude
            ) : null;

            return (
              <div
                key={market.id}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail Image with status pill */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={market.image}
                    alt={market.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                      status.isOpenNow
                        ? 'bg-emerald-600/90 text-white border border-emerald-400'
                        : 'bg-stone-900/80 text-stone-200 border border-stone-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${status.isOpenNow ? 'bg-emerald-300 animate-pulse' : 'bg-stone-400'}`} />
                      <span>{status.statusLabel}</span>
                    </span>

                    {distance !== null && (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-white/90 text-stone-800 backdrop-blur-md border border-stone-200">
                        {formatDistance(distance)}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark('market', market.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark market'}
                    aria-label={`Bookmark ${market.name}`}
                  >
                    <Heart className={`w-4 h-4 ${bookmarked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{market.area}</span>
                  </div>

                  <h3 className="text-xl font-bold font-serif text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {market.name}
                  </h3>

                  <p className="text-xs text-stone-500 font-medium mt-1">
                    {market.operatingDays.join(' & ')} · {status.nextOpenNotice}
                  </p>

                  <p className="text-sm text-stone-600 line-clamp-2 mt-3 flex-1 leading-relaxed">
                    {market.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-400">
                      {market.amenities.snapEbt ? '✓ SNAP / EBT Accepted' : 'Cash & Cards'}
                    </span>

                    <button
                      onClick={() => navigateTo('market-detail', { marketId: market.id })}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Schedule &amp; Map</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* This Week's Seasonal Picks (SRS Requirement) */}
      <section className="bg-emerald-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Current Harvest Spotlight</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif">
              This Week&apos;s Seasonal Picks
            </h2>
            <p className="text-emerald-200 text-sm mt-1 max-w-xl">
              Harvested at the crest of flavor and nutrition in {currentSeason}. Support your local farmers and savor authentic regional produce.
            </p>
          </div>

          <button
            onClick={() => navigateTo('seasonal')}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold border border-emerald-600 transition-colors shrink-0"
          >
            Explore Seasonal Calendar →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalPicks.map(produce => {
            const bookmarked = isBookmarked('produce', produce.id);

            return (
              <div
                key={produce.id}
                className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500 transition-all group"
              >
                <div>
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                    <img
                      src={produce.image}
                      alt={produce.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleBookmark('produce', produce.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/70 hover:bg-stone-900 text-stone-200 hover:text-rose-400 backdrop-blur-xs transition-colors"
                      title="Bookmark produce"
                    >
                      <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <span className="absolute bottom-2 left-2 text-2xl drop-shadow-md">
                      {produce.icon}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    {produce.category}
                  </span>
                  
                  <h3 className="text-base font-bold font-serif text-white mt-0.5">
                    {produce.name}
                  </h3>

                  <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {produce.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-900 flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-medium">
                    {produce.marketIds.length} Markets Carrying
                  </span>

                  <button
                    onClick={() => navigateTo('produce-guide', { produceId: produce.id })}
                    className="text-emerald-200 hover:text-white font-semibold underline underline-offset-2"
                  >
                    Guide info
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Community Values & Why FreshFind Matters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Why Shop Farmers Markets With FreshFind?
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            The eGreen Basket philosophy turns everyday grocery runs into impactful climate and community stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-bold text-lg font-serif text-stone-900">Zero Guesswork Schedules</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Real-time clock checks tell you instantly if your favorite stand is open right now, what day it operates, and how to get there.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-bold text-lg font-serif text-stone-900">Support Local Micro-Farms</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every dollar spent directly rewards regional growers, sustains open farmlands, and dramatically slashes long-distance transport emissions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-teal-700" />
            </div>
            <h3 className="font-bold text-lg font-serif text-stone-900">Transparent &amp; Accessible</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              All market listings include detailed SNAP/EBT acceptance, parking instructions, pet policies, and wheelchair accessibility notes.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
