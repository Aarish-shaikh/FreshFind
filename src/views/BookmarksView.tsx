import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, 
  MapPin, 
  Apple, 
  Download, 
  Share2, 
  Copy, 
  Trash2, 
  Edit3, 
  Save, 
  ExternalLink, 
  FileText, 
  Check, 
  Clock, 
  ArrowRight,
  Sparkles,
  MessageCircle,
  Mail
} from 'lucide-react';
import { getMarketOpenStatus } from '../utils/schedule';

export const BookmarksView: React.FC = () => {
  const { 
    bookmarks, 
    markets, 
    produceList, 
    currentTime, 
    removeBookmark, 
    updateBookmarkNote, 
    navigateTo, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'markets' | 'produce'>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedList, setCopiedList] = useState(false);

  const marketBookmarks = bookmarks.filter(b => b.type === 'market');
  const produceBookmarks = bookmarks.filter(b => b.type === 'produce');

  const displayedBookmarks = activeTab === 'all' 
    ? bookmarks 
    : activeTab === 'markets' 
      ? marketBookmarks 
      : produceBookmarks;

  // Generate formatted text list of saved items
  const generateFormattedList = (): string => {
    let text = `=========================================\n`;
    text += `  FRESHFIND (eGREEN BASKET) - SAVED LIST \n`;
    text += `  Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += `=========================================\n\n`;

    if (marketBookmarks.length > 0) {
      text += `--- SAVED FARMERS MARKETS (${marketBookmarks.length}) ---\n`;
      marketBookmarks.forEach((bm, i) => {
        const m = markets.find(item => item.id === bm.targetId);
        if (m) {
          text += `${i + 1}. ${m.name}\n`;
          text += `   Area: ${m.area} (${m.address}, ${m.city})\n`;
          text += `   Operating Days: ${m.operatingDays.join(', ')}\n`;
          if (bm.personalNotes) {
            text += `   Personal Note: "${bm.personalNotes}"\n`;
          }
          text += `\n`;
        }
      });
    }

    if (produceBookmarks.length > 0) {
      text += `--- SAVED SEASONAL PRODUCE (${produceBookmarks.length}) ---\n`;
      produceBookmarks.forEach((bm, i) => {
        const p = produceList.find(item => item.id === bm.targetId);
        if (p) {
          text += `${i + 1}. ${p.name} (${p.category})\n`;
          text += `   Peak Seasons: ${p.season.join(', ')}\n`;
          text += `   Storage Tip: ${p.storageTips}\n`;
          if (bm.personalNotes) {
            text += `   Personal Note: "${bm.personalNotes}"\n`;
          }
          text += `\n`;
        }
      });
    }

    text += `Discover more markets & seasonal guides at FreshFind: Fresh All Along!\n`;
    return text;
  };

  // Export as .txt formatted list
  const handleExportFormattedFile = () => {
    if (bookmarks.length === 0) {
      showToast('Your basket is empty. Bookmark some markets or produce first!', 'warning');
      return;
    }
    const formatted = generateFormattedList();
    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `freshfind-egreen-basket-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Saved list exported as formatted text file!', 'success');
  };

  // Copy formatted list to clipboard
  const handleCopyFormattedList = async () => {
    if (bookmarks.length === 0) {
      showToast('No saved items to copy.', 'warning');
      return;
    }
    const formatted = generateFormattedList();
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedList(true);
      showToast('Formatted market list copied to clipboard!', 'success');
      setTimeout(() => setCopiedList(false), 3000);
    } catch {
      showToast('Could not copy text to clipboard.', 'warning');
    }
  };

  const handleStartEditNote = (targetId: string, currentNote: string = '') => {
    setEditingNoteId(targetId);
    setNoteContent(currentNote);
  };

  const handleSaveNote = (targetId: string) => {
    updateBookmarkNote(targetId, noteContent);
    setEditingNoteId(null);
  };

  // Social share triggers
  const shareText = `Check out my saved farmers markets and fresh produce list on FreshFind (eGreen Basket)!`;
  const shareUrl = window.location.origin;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My FreshFind eGreen Basket',
          text: shareText,
          url: shareUrl
        });
        showToast('Shared successfully!', 'success');
        return;
      } catch {
        // user cancelled or failed
      }
    }
    setShareModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-8">
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>Saved Basket &amp; Bookmarking System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mt-1">
            My Bookmarked Favorites
          </h1>
          <p className="text-stone-600 text-sm mt-1 max-w-xl">
            Keep track of favorite neighborhood markets, saved produce items, and personal session shopping notes. Export or share your curated list anytime.
          </p>
        </div>

        {/* Export & Share buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyFormattedList}
            disabled={bookmarks.length === 0}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {copiedList ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{copiedList ? 'Copied' : 'Copy List'}</span>
          </button>

          <button
            onClick={handleExportFormattedFile}
            disabled={bookmarks.length === 0}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Formatted List</span>
          </button>

          <button
            onClick={handleNativeShare}
            disabled={bookmarks.length === 0}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Share2 className="w-4 h-4 text-emerald-700" />
            <span>Share via Social</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          All Saved Items ({bookmarks.length})
        </button>
        <button
          onClick={() => setActiveTab('markets')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'markets'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Farmers Markets ({marketBookmarks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('produce')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'produce'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Produce Entries ({produceBookmarks.length})</span>
        </button>
      </div>

      {/* Bookmarks Items List */}
      {displayedBookmarks.length > 0 ? (
        <div className="space-y-4">
          {displayedBookmarks.map(bm => {
            const isMarket = bm.type === 'market';
            const market = isMarket ? markets.find(m => m.id === bm.targetId) : null;
            const produce = !isMarket ? produceList.find(p => p.id === bm.targetId) : null;

            if (!market && !produce) return null;

            const isEditing = editingNoteId === bm.targetId;
            const marketStatus = market ? getMarketOpenStatus(market, currentTime) : null;

            return (
              <div
                key={bm.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start justify-between"
              >
                {/* Left: Thumbnail & Main Info */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={market ? market.image : produce?.image}
                    alt={market ? market.name : produce?.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-stone-200"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isMarket ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isMarket ? 'Farmers Market' : produce?.category}
                      </span>

                      {marketStatus && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          marketStatus.isOpenNow ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {marketStatus.statusLabel}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                      {market ? market.name : produce?.name}
                    </h3>

                    <p className="text-xs text-stone-500">
                      {market 
                        ? `${market.area} · Operating: ${market.operatingDays.join(', ')}` 
                        : `Seasons: ${produce?.season.join(', ')}`}
                    </p>

                    {/* Attached Personal Note Display / Editor */}
                    <div className="mt-3 pt-3 border-t border-stone-100 max-w-xl">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteContent}
                            onChange={e => setNoteContent(e.target.value)}
                            placeholder="Add your personal session shopping note..."
                            rows={2}
                            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveNote(bm.targetId)}
                              className="px-3 py-1 bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save Note</span>
                            </button>
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-3 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2 bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/70">
                          <div className="text-xs text-stone-700">
                            <span className="font-bold text-stone-900 block text-[11px] mb-0.5">
                              Personal Session Note:
                            </span>
                            <p className="italic text-stone-600">
                              {bm.personalNotes ? `"${bm.personalNotes}"` : 'No personal note added yet.'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleStartEditNote(bm.targetId, bm.personalNotes)}
                            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold p-1 shrink-0 flex items-center gap-1"
                            title="Edit note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{bm.personalNotes ? 'Edit' : 'Add Note'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                  <button
                    onClick={() => {
                      if (isMarket) {
                        navigateTo('market-detail', { marketId: market!.id });
                      } else {
                        navigateTo('produce-guide', { produceId: produce!.id });
                      }
                    }}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => removeBookmark(bm.targetId)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Remove from bookmarks"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900">Your Basket is Currently Empty</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            You can bookmark any farmers market or produce guide entry by clicking the heart icon. Your saved items and session notes will appear here.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigateTo('directory')}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Browse Farmers Markets
            </button>
            <button
              onClick={() => navigateTo('produce-guide')}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Explore Produce Guide
            </button>
          </div>
        </div>
      )}

      {/* Social Share Modal Dialog (SRS Requirement) */}
      {shareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-700" />
                <span>Share Your FreshFind Basket</span>
              </h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Share your favorite farmers markets with family and friends across your preferred social channel:
            </p>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-2 text-xs font-semibold text-stone-800 transition-colors"
              >
                <span>𝕏 (Twitter)</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-2 text-xs font-semibold text-stone-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent('Check out my FreshFind Farmers Market Basket')}&body=${encodeURIComponent(`${shareText}\n\n${generateFormattedList()}`)}`}
                className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-2 text-xs font-semibold text-stone-800 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-600" />
                <span>Email List</span>
              </a>

              <button
                onClick={handleCopyFormattedList}
                className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 flex items-center gap-2 text-xs font-semibold text-stone-800 transition-colors text-left"
              >
                <Copy className="w-4 h-4 text-stone-600" />
                <span>Copy List</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShareModalOpen(false)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
