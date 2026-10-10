import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Apple, 
  SlidersHorizontal, 
  Heart, 
  ArrowUpDown, 
  Compass, 
  Clock, 
  Check, 
  X, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getMarketOpenStatus, getNextOpenDayScore, getCurrentDayName } from '../utils/schedule';
import { calculateDistanceMiles, formatDistance } from '../utils/geolocation';
import { DayOfWeek, ProduceCategory, Market } from '../types';

export const MarketDirectoryView: React.FC = () => {
  const { 
    markets, 
    currentTime, 
    userLocation, 
    requestUserLocation, 
    isLocating, 
    locationError,
    navigateTo, 
    toggleBookmark, 
    isBookmarked,
    activeFilterNeighborhood,
    setActiveFilterNeighborhood,
    activeFilterDay,
    setActiveFilterDay,
    activeFilterCategory,
    setActiveFilterCategory,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [sortOption, setSortOption] = useState<'alpha-asc' | 'alpha-desc' | 'proximity' | 'next-open'>('alpha-asc');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  const neighborhoods = useMemo(() => Array.from(new Set(markets.map(m => m.area))), [markets]);
  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories: ProduceCategory[] = [
    'Vegetables',
    'Fruits',
    'Herbs & Greens',
    'Dairy & Eggs',
    'Artisanal & Bakery',
    'Honey & Preserves'
  ];

  const currentDayName = getCurrentDayName(currentTime);

  // Filter & Search
  const filteredMarkets = useMemo(() => {
    return markets.filter(market => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = market.name.toLowerCase().includes(q);
        const matchesArea = market.area.toLowerCase().includes(q);
        const matchesDesc = market.description.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesDesc) return false;
      }

      // Neighborhood filter
      if (activeFilterNeighborhood !== 'all' && market.area !== activeFilterNeighborhood) {
        return false;
      }

      // Day of week filter
      if (activeFilterDay !== 'all' && !market.operatingDays.includes(activeFilterDay as DayOfWeek)) {
        return false;
      }

      // Produce category filter
      if (activeFilterCategory !== 'all' && !market.produceCategories.includes(activeFilterCategory as ProduceCategory)) {
        return false;
      }

      // Only Open Now filter
      if (onlyOpenNow) {
        const status = getMarketOpenStatus(market, currentTime);
        if (!status.isOpenNow) return false;
      }

      return true;
    });
  }, [markets, searchQuery, activeFilterNeighborhood, activeFilterDay, activeFilterCategory, onlyOpenNow, currentTime]);

  // Sort logic
  const sortedMarkets = useMemo(() => {
    const list = [...filteredMarkets];

    if (sortOption === 'alpha-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'alpha-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'proximity') {
      if (userLocation) {
        list.sort((a, b) => {
          const distA = calculateDistanceMiles(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
          const distB = calculateDistanceMiles(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
          return distA - distB;
        });
      }
    } else if (sortOption === 'next-open') {
      list.sort((a, b) => {
        const scoreA = getNextOpenDayScore(a, currentTime);
        const scoreB = getNextOpenDayScore(b, currentTime);
        return scoreA - scoreB;
      });
    }

    return list;
  }, [filteredMarkets, sortOption, userLocation, currentTime]);

  const handleProximitySortClick = async () => {
    if (!userLocation) {
      await requestUserLocation();
    }
    setSortOption('proximity');
  };

  const clearAllFilters = () => {
    setActiveFilterNeighborhood('all');
    setActiveFilterDay('all');
    setActiveFilterCategory('all');
    setSearchQuery('');
    setOnlyOpenNow(false);
  };

  const hasActiveFilters = activeFilterNeighborhood !== 'all' || 
    activeFilterDay !== 'all' || 
    activeFilterCategory !== 'all' || 
    Boolean(searchQuery) || 
    onlyOpenNow;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Directory Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Community Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-1">
            Farmers Market Directory
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Browse verified regional farmers markets. Filter by neighborhood, operating weekday, or seasonal produce type, and sort by proximity or next open day.
          </p>
        </div>

        {/* Location GPS trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleProximitySortClick}
            disabled={isLocating}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              sortOption === 'proximity' && userLocation
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            <Compass className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Detecting Location...' : userLocation ? 'Sorted by Proximity' : 'Sort by Distance (GPS)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-100/90 space-y-4">
        
        {/* Search input & Open now toggle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="relative md:col-span-8">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search markets by name, neighborhood, or keyword..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-800 placeholder-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick "Open Now" filter toggle */}
          <div className="md:col-span-4 flex items-center justify-end">
            <button
              onClick={() => setOnlyOpenNow(!onlyOpenNow)}
              className={`w-full md:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors border ${
                onlyOpenNow
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Open Right Now</span>
              {onlyOpenNow && <Check className="w-3.5 h-3.5 ml-1" />}
            </button>
          </div>
        </div>

        {/* Dropdown Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {/* Neighborhood filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Neighborhood
            </label>
            <select
              value={activeFilterNeighborhood}
              onChange={e => setActiveFilterNeighborhood(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Neighborhoods ({neighborhoods.length})</option>
              {neighborhoods.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Day of Week filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Operating Day
            </label>
            <select
              value={activeFilterDay}
              onChange={e => setActiveFilterDay(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Any Day of the Week</option>
              {daysOfWeek.map(d => (
                <option key={d} value={d}>
                  {d} {d === currentDayName ? '(Today)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Produce Category filter */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Produce Available
            </label>
            <select
              value={activeFilterCategory}
              onChange={e => setActiveFilterCategory(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sorting options */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-emerald-700" />
              <span>Sort Order</span>
            </label>
            <select
              value={sortOption}
              onChange={e => {
                const val = e.target.value as typeof sortOption;
                if (val === 'proximity' && !userLocation) {
                  handleProximitySortClick();
                } else {
                  setSortOption(val);
                }
              }}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="alpha-asc">Alphabetical (A to Z)</option>
              <option value="alpha-desc">Alphabetical (Z to A)</option>
              <option value="proximity">Proximity (Closest First)</option>
              <option value="next-open">Next Opening Day</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips / Clear bar */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-500 font-medium">Active filters:</span>
              {activeFilterNeighborhood !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-semibold">
                  <span>Area: {activeFilterNeighborhood}</span>
                  <button onClick={() => setActiveFilterNeighborhood('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeFilterDay !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-semibold">
                  <span>Day: {activeFilterDay}</span>
                  <button onClick={() => setActiveFilterDay('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {activeFilterCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-semibold">
                  <span>Produce: {activeFilterCategory}</span>
                  <button onClick={() => setActiveFilterCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {onlyOpenNow && (
                <span className="inline-flex items-center gap-1 bg-emerald-700 text-white px-2.5 py-1 rounded-full font-semibold">
                  <span>Open Now</span>
                  <button onClick={() => setOnlyOpenNow(false)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-stone-200 text-stone-800 px-2.5 py-1 rounded-full font-semibold">
                  <span>&quot;{searchQuery}&quot;</span>
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600 px-1">
        <span>
          Showing <strong className="text-stone-900">{sortedMarkets.length}</strong> of {markets.length} farmers markets
        </span>
        {userLocation && (
          <span className="text-emerald-700 font-medium hidden sm:inline">
            📍 Distance calculated from your current location
          </span>
        )}
      </div>

      {/* Markets Cards Grid (SRS Requirement) */}
      {sortedMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMarkets.map(market => {
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
                {/* Thumbnail Image */}
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img
                    src={market.image}
                    alt={market.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status & Distance badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                      status.isOpenNow
                        ? 'bg-emerald-600/90 text-white border border-emerald-400'
                        : 'bg-stone-900/80 text-stone-200 border border-stone-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${status.isOpenNow ? 'bg-emerald-300 animate-pulse' : 'bg-stone-400'}`} />
                      <span>{status.statusLabel}</span>
                    </span>

                    {distance !== null && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-stone-800 backdrop-blur-md border border-stone-200 shadow-2xs">
                        {formatDistance(distance)}
                      </span>
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark('market', market.id)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark market'}
                    aria-label={`Bookmark ${market.name}`}
                  >
                    <Heart className={`w-4 h-4 ${bookmarked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{market.area}</span>
                      </span>
                      <span className="text-stone-400 font-normal">{market.city}, {market.state}</span>
                    </div>

                    <h2 className="text-xl font-bold font-serif text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {market.name}
                    </h2>

                    <div className="text-xs text-stone-600 space-y-0.5">
                      <p className="font-semibold text-emerald-900">
                        Operating: {market.operatingDays.join(', ')}
                      </p>
                      <p className="text-stone-500">
                        {status.nextOpenNotice}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                      {market.description}
                    </p>
                  </div>

                  {/* Available Produce Categories Badges */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                      Typical Produce:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {market.produceCategories.map(cat => (
                        <span
                          key={cat}
                          className="text-[11px] bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-100"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      {market.amenities.snapEbt ? '✓ SNAP / EBT' : 'Cash & Card'}
                    </span>

                    <button
                      onClick={() => navigateTo('market-detail', { marketId: market.id })}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>View Detail &amp; Map</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">No Farmers Markets Found</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            We couldn&apos;t find any markets matching your active filters. Try resetting your search terms or exploring all operating days.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
