import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  Car, 
  Dog, 
  CreditCard, 
  Accessibility, 
  Music, 
  Apple, 
  FileText, 
  Save, 
  ExternalLink,
  Navigation
} from 'lucide-react';
import { getMarketOpenStatus, getCurrentDayName } from '../utils/schedule';
import { calculateDistanceMiles, formatDistance } from '../utils/geolocation';

export const MarketDetailView: React.FC = () => {
  const { 
    selectedMarketId, 
    markets, 
    produceList, 
    currentTime, 
    userLocation, 
    navigateTo, 
    toggleBookmark, 
    isBookmarked,
    bookmarks,
    updateBookmarkNote,
    showToast
  } = useApp();

  const market = markets.find(m => m.id === selectedMarketId) || markets[0];
  const isSaved = isBookmarked('market', market.id);
  const bookmarkRecord = bookmarks.find(b => b.targetId === market.id);

  const [noteText, setNoteText] = useState(bookmarkRecord?.personalNotes || '');
  const [shareSuccess, setShareSuccess] = useState(false);

  const status = getMarketOpenStatus(market, currentTime);
  const currentDayName = getCurrentDayName(currentTime);

  const distance = userLocation ? calculateDistanceMiles(
    userLocation.latitude,
    userLocation.longitude,
    market.latitude,
    market.longitude
  ) : null;

  // Filter produce available at this market
  const marketProduce = produceList.filter(p => p.marketIds.includes(market.id));

  const handleSaveNote = () => {
    if (!isSaved) {
      toggleBookmark('market', market.id);
    }
    updateBookmarkNote(market.id, noteText);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${market.name} on FreshFind`;
    const shareText = `Check out ${market.name} in ${market.area}! ${market.tagline}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        showToast('Shared successfully!', 'success');
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareTitle} - ${shareText}`);
      setShareSuccess(true);
      showToast('Market details copied to clipboard for sharing!', 'success');
      setTimeout(() => setShareSuccess(false), 3000);
    } catch {
      showToast('Sharing link prepared.', 'info');
    }
  };

  // Google Maps embed URL using coordinate query
  const mapEmbedUrl = `https://maps.google.com/maps?q=${market.latitude},${market.longitude}&hl=en&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${market.address}, ${market.city}, ${market.state} ${market.zip}`)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-10">
      
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('directory')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 px-3 py-2 rounded-xl bg-white border border-emerald-200 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Market Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition-colors"
          >
            <Share2 className="w-4 h-4 text-stone-500" />
            <span>{shareSuccess ? 'Copied!' : 'Share Market'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark('market', market.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs ${
              isSaved
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-rose-600' : 'text-white'}`} />
            <span>{isSaved ? 'In Your Saved Basket' : 'Bookmark Market'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-emerald-100 shadow-sm">
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-stone-900">
          <img
            src={market.image}
            alt={market.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          {/* Overlay info */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/30 text-white">
                {market.area}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-1.5 ${
                status.isOpenNow ? 'bg-emerald-500 text-white' : 'bg-stone-800/90 text-stone-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${status.isOpenNow ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
                <span>{status.statusLabel}</span>
              </span>
              {distance !== null && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/80 text-emerald-100 border border-emerald-700/60">
                  {formatDistance(distance)}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
              {market.name}
            </h1>

            <p className="text-emerald-100/90 text-xs sm:text-base max-w-3xl">
              {market.tagline}
            </p>
          </div>
        </div>

        {/* Quick meta strip */}
        <div className="p-6 bg-emerald-50/50 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-stone-700">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold">{market.address}, {market.city}, {market.state} {market.zip}</span>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Open in Google Maps Directions</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>
      </div>

      {/* Main Grid: Details, Schedule, Map, and Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 cols: About, Schedule, Products */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900">
              About This Farmers Market
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {market.description}
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-2">
                Available Produce Specialties:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {market.produceCategories.map(cat => (
                  <span
                    key={cat}
                    className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-3 py-1 rounded-xl border border-emerald-200/70"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule: Operating days and hours (Weekly schedule table - SRS Requirement) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Weekly Timetable</span>
                </div>
                <h2 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                  Operating Days &amp; Hours
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                {status.nextOpenNotice}
              </span>
            </div>

            {/* Weekly Schedule Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-200 mt-4">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4">Day of Week</th>
                    <th className="py-3 px-4">Operating Status</th>
                    <th className="py-3 px-4 text-right">Hours of Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {market.scheduleDetails.map(sched => {
                    const isToday = sched.day === currentDayName;
                    return (
                      <tr
                        key={sched.day}
                        className={`transition-colors ${
                          isToday ? 'bg-emerald-50/80 font-semibold text-emerald-950' : 'hover:bg-stone-50/50 text-stone-700'
                        }`}
                      >
                        <td className="py-3 px-4 flex items-center gap-2">
                          <span>{sched.day}</span>
                          {isToday && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-700 text-white font-mono">
                              Today
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {sched.isOpen ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Open</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-stone-400">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Closed</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {sched.displayHours}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Available: Grid of items typically available (SRS Requirement) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <Apple className="w-4 h-4 text-emerald-600" />
                <span>Farm-Fresh Inventory</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-stone-900 mt-0.5">
                Produce &amp; Products Typically Available
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Click any item below to view seasonal harvesting notes and nutritional highlights in the Produce Guide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {marketProduce.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigateTo('produce-guide', { produceId: item.id })}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold font-serif text-stone-900 truncate">
                      {item.icon} {item.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right 5 cols: Map, Amenities, Contact, Session Notes */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Location Details: Embedded Google Map (SRS Requirement) */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <span>Market Map &amp; Location</span>
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                {market.latitude.toFixed(4)}, {market.longitude.toFixed(4)}
              </span>
            </div>

            <p className="text-xs text-stone-600">
              {market.address}, {market.city}, {market.state} {market.zip} ({market.area})
            </p>

            {/* Embedded Google Map Iframe */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-stone-200 shadow-inner bg-stone-100">
              <iframe
                title={`Map of ${market.name}`}
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                aria-label={`Interactive map of ${market.name}`}
              />
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl text-center flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Turn-by-Turn GPS Directions</span>
            </a>
          </div>

          {/* Personal Session Notes (Content Bookmarking System - SRS Requirement) */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <span>Personal Session Notes</span>
              </h2>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                Saved in Basket
              </span>
            </div>

            <p className="text-xs text-stone-500">
              Attach private shopper notes to this market (e.g., preferred stalls, parking reminders, items to pick up).
            </p>

            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="e.g., Visit the apple orchard stall at booth #14 before 10 AM for Honeycrisp cider..."
              rows={3}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none"
            />

            <button
              onClick={handleSaveNote}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Note to Saved Basket</span>
            </button>
          </div>

          {/* Amenities & Accessibility */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-serif text-stone-900">
              Amenities &amp; Visitor Policies
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Parking:</span>
                  <span className="text-stone-500 text-xs">{market.amenities.parking}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold">SNAP / EBT &amp; Double Up: </span>
                  <span className="text-stone-600">{market.amenities.snapEbt ? 'Accepted' : 'Not accepted'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Dog className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold">Pet Policy: </span>
                  <span className="text-stone-600">{market.amenities.dogFriendly ? 'Dogs allowed on leash' : 'Service animals only'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Accessibility className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold">Wheelchair Access: </span>
                  <span className="text-stone-600">{market.amenities.wheelchairAccessible ? 'Accessible paved paths' : 'Standard park terrain'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Music className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold">Community Live Music: </span>
                  <span className="text-stone-600">{market.amenities.liveMusic ? 'Featured weekly' : 'No regular stage'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Market Management */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3 text-xs sm:text-sm">
            <h2 className="text-lg font-bold font-serif text-stone-900">
              Market Information &amp; Contact
            </h2>

            <div className="space-y-2 text-stone-600">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-stone-800">Manager:</span>
                <span>{market.contact.manager}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{market.contact.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{market.contact.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">{market.contact.website}</span>
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
