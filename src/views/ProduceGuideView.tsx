import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Apple, 
  Search, 
  Filter, 
  Heart, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Info, 
  ChevronRight, 
  X,
  FileText,
  Save,
  Check
} from 'lucide-react';
import { ProduceCategory, Season } from '../types';

export const ProduceGuideView: React.FC = () => {
  const { 
    produceList, 
    markets, 
    selectedProduceId, 
    setSelectedProduceId, 
    navigateTo, 
    toggleBookmark, 
    isBookmarked,
    bookmarks,
    updateBookmarkNote
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalId, setActiveModalId] = useState<string | null>(selectedProduceId);
  const [noteDraft, setNoteDraft] = useState<string>('');

  const categories: ProduceCategory[] = [
    'Vegetables',
    'Fruits',
    'Herbs & Greens',
    'Dairy & Eggs',
    'Artisanal & Bakery',
    'Honey & Preserves'
  ];

  const seasonsList: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-Round'];

  // Keep modal in sync with selectedProduceId if provided from outside
  React.useEffect(() => {
    if (selectedProduceId) {
      setActiveModalId(selectedProduceId);
      const existing = bookmarks.find(b => b.targetId === selectedProduceId);
      setNoteDraft(existing?.personalNotes || '');
    }
  }, [selectedProduceId, bookmarks]);

  const filteredProduce = useMemo(() => {
    return produceList.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesHealth = item.nutritionalHighlights.some(h => h.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesHealth) return false;
      }

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedSeasonFilter !== 'all' && !item.season.includes(selectedSeasonFilter as Season)) {
        return false;
      }

      return true;
    });
  }, [produceList, searchQuery, selectedCategory, selectedSeasonFilter]);

  const openProduceModal = (id: string) => {
    setActiveModalId(id);
    setSelectedProduceId(id);
    const existing = bookmarks.find(b => b.targetId === id);
    setNoteDraft(existing?.personalNotes || '');
  };

  const closeProduceModal = () => {
    setActiveModalId(null);
    setSelectedProduceId(null);
  };

  const handleSaveModalNote = (produceId: string) => {
    if (!isBookmarked('produce', produceId)) {
      toggleBookmark('produce', produceId);
    }
    updateBookmarkNote(produceId, noteDraft);
  };

  const activeModalItem = activeModalId ? produceList.find(p => p.id === activeModalId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Page Title & Intro */}
      <div className="border-b border-emerald-100 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
          <Apple className="w-4 h-4 text-emerald-600" />
          <span>Botanical &amp; Culinary Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-1">
          Produce &amp; Harvest Guide
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-2xl">
          Learn what makes local varieties exceptional, discover optimal seasons and culinary storage tips, and see which local farmers markets carry each product.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-emerald-100/90 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search produce by name, nutrition highlight, or health benefits..."
            className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-stone-800"
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

        {/* Category Buttons Row */}
        <div>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
            Filter by Category:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-emerald-50 border border-stone-200'
              }`}
            >
              All Categories ({produceList.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-50 text-stone-700 hover:bg-emerald-50 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Season Selector */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">Harvest Season:</span>
          <button
            onClick={() => setSelectedSeasonFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${
              selectedSeasonFilter === 'all'
                ? 'bg-emerald-100 text-emerald-900 font-bold'
                : 'text-stone-600 hover:text-emerald-800'
            }`}
          >
            All Seasons
          </button>
          {seasonsList.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeasonFilter(s)}
              className={`px-2.5 py-1 rounded-lg ${
                selectedSeasonFilter === s
                  ? 'bg-emerald-100 text-emerald-900 font-bold'
                  : 'text-stone-600 hover:text-emerald-800'
              }`}
            >
              {s}
            </button>
          ))}

          {(selectedCategory !== 'all' || selectedSeasonFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSeasonFilter('all');
                setSearchQuery('');
              }}
              className="ml-auto text-xs font-semibold text-rose-700 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Produce Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProduce.map(item => {
          const bookmarked = isBookmarked('produce', item.id);
          const carryingMarkets = markets.filter(m => item.marketIds.includes(m.id));

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group justify-between"
            >
              <div>
                {/* Image & Icon */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-emerald-900 backdrop-blur-md shadow-2xs">
                    {item.category}
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark('produce', item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md backdrop-blur-xs transition-colors"
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark produce'}
                    aria-label={`Bookmark ${item.name}`}
                  >
                    <Heart className={`w-4 h-4 ${bookmarked ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>

                  <span className="absolute bottom-2 left-3 text-3xl drop-shadow-md">
                    {item.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {item.name}
                    </h3>
                    
                    {/* Season Badges */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {item.season.map(s => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Linked Markets Preview */}
                  <div className="pt-2 border-t border-stone-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      Found at {carryingMarkets.length} Markets:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {carryingMarkets.map(m => (
                        <button
                          key={m.id}
                          onClick={() => navigateTo('market-detail', { marketId: m.id })}
                          className="text-[11px] text-stone-600 hover:text-emerald-900 bg-stone-50 hover:bg-emerald-50 px-2 py-0.5 rounded border border-stone-200 transition-colors truncate max-w-[140px]"
                          title={`Go to ${m.name}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => openProduceModal(item.id)}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 border border-emerald-200/60"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Nutrition &amp; Storage Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Produce Detail Modal Dialog */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative h-56 sm:h-64 bg-stone-900 shrink-0">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <button
                onClick={closeProduceModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                  {activeModalItem.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif flex items-center gap-2">
                  <span>{activeModalItem.icon}</span>
                  <span>{activeModalItem.name}</span>
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-stone-700 text-xs sm:text-sm">
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-1">About This Variety</h3>
                <p className="leading-relaxed text-stone-600">{activeModalItem.description}</p>
              </div>

              {/* Peak Season & Harvesting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <div>
                  <span className="font-bold text-emerald-950 block text-xs">Seasons:</span>
                  <span className="text-emerald-800 text-xs">{activeModalItem.season.join(', ')}</span>
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block text-xs">Peak Harvest Months:</span>
                  <span className="text-emerald-800 text-xs">{activeModalItem.peakMonths.join(', ')}</span>
                </div>
              </div>

              {/* Nutritional Highlights */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-2">Nutritional Highlights:</h3>
                <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                  {activeModalItem.nutritionalHighlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              </div>

              {/* Storage & Culinary Tips */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-1">How to Store &amp; Savor:</h3>
                <p className="leading-relaxed text-stone-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  {activeModalItem.storageTips}
                </p>
              </div>

              {/* Linked Markets */}
              <div>
                <h3 className="font-bold text-stone-900 text-sm mb-2">Where to Find in Metro Area:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {markets.filter(m => activeModalItem.marketIds.includes(m.id)).map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        closeProduceModal();
                        navigateTo('market-detail', { marketId: m.id });
                      }}
                      className="p-2.5 rounded-xl border border-emerald-100 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-left transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-xs text-stone-900 block truncate">{m.name}</span>
                        <span className="text-[10px] text-stone-500">{m.area}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Session Note for this Produce */}
              <div className="pt-2 border-t border-stone-200 space-y-2">
                <label className="font-bold text-stone-900 text-xs flex items-center justify-between">
                  <span>Session Note for this Produce:</span>
                  <span className="text-[10px] font-normal text-stone-400">Attached to bookmark</span>
                </label>
                <textarea
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  placeholder="e.g. Look for Heirloom Brandywine at the organic table; delicious with basil pesto..."
                  rows={2}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSaveModalNote(activeModalItem.id)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Note to Saved Basket</span>
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => toggleBookmark('produce', activeModalItem.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isBookmarked('produce', activeModalItem.id)
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isBookmarked('produce', activeModalItem.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{isBookmarked('produce', activeModalItem.id) ? 'In Saved Basket' : 'Bookmark Produce'}</span>
              </button>

              <button
                onClick={closeProduceModal}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
