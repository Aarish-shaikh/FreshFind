import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Market, ProduceItem, BookmarkItem, PageView, UserCoordinates } from '../types';
import marketsData from '../data/markets.json';
import produceData from '../data/produce.json';
import { DEFAULT_CITY_COORDINATES } from '../utils/geolocation';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  currentPage: PageView;
  selectedMarketId: string | null;
  selectedProduceId: string | null;
  markets: Market[];
  produceList: ProduceItem[];
  bookmarks: BookmarkItem[];
  userLocation: UserCoordinates | null;
  isLocating: boolean;
  locationError: string | null;
  currentTime: Date;
  visitorCount: number;
  authModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  chatbotOpen: boolean;
  activeFilterNeighborhood: string;
  activeFilterDay: string;
  activeFilterCategory: string;
  searchQuery: string;
  toasts: ToastState[];
  
  // Navigation & Actions
  navigateTo: (page: PageView, options?: { 
    marketId?: string; 
    produceId?: string; 
    area?: string; 
    day?: string; 
    category?: string;
    query?: string;
  }) => void;
  setSelectedMarketId: (id: string | null) => void;
  setSelectedProduceId: (id: string | null) => void;
  toggleBookmark: (type: 'market' | 'produce', targetId: string) => void;
  isBookmarked: (type: 'market' | 'produce', targetId: string) => boolean;
  updateBookmarkNote: (targetId: string, note: string) => void;
  removeBookmark: (targetId: string) => void;
  requestUserLocation: () => Promise<void>;
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  setChatbotOpen: (open: boolean) => void;
  setActiveFilterNeighborhood: (area: string) => void;
  setActiveFilterDay: (day: string) => void;
  setActiveFilterCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BOOKMARKS_STORAGE_KEY = 'freshfind_egreen_bookmarks_v1';
const VISITOR_COUNT_STORAGE_KEY = 'freshfind_visitor_count_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedProduceId, setSelectedProduceId] = useState<string | null>(null);

  // Filters for directory
  const [activeFilterNeighborhood, setActiveFilterNeighborhood] = useState<string>('all');
  const [activeFilterDay, setActiveFilterDay] = useState<string>('all');
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Markets and Produce loaded from pre-populated JSON data
  const [markets] = useState<Market[]>(marketsData as unknown as Market[]);
  const [produceList] = useState<ProduceItem[]>(produceData as unknown as ProduceItem[]);

  // Bookmarks persisted in localStorage
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Pre-populate with 1 market bookmark for welcoming user
    return [
      {
        id: 'bm-init-1',
        type: 'market',
        targetId: 'm1',
        addedAt: new Date().toISOString(),
        personalNotes: 'Remember to arrive early around 9 AM for fresh sourdough and heirloom tomatoes!'
      }
    ];
  });

  // User location
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Simulated visitor counter
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(VISITOR_COUNT_STORAGE_KEY);
      if (stored) {
        const val = parseInt(stored, 10);
        if (!isNaN(val)) return val + 1;
      }
    } catch {
      // fallback
    }
    return 14832;
  });

  // Modals & Chatbot
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Clock tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  // Save visitor count to localStorage and slow natural ticker
  useEffect(() => {
    try {
      localStorage.setItem(VISITOR_COUNT_STORAGE_KEY, visitorCount.toString());
    } catch {
      // ignore
    }
    // Simulate occasional incoming visitor every 20-40 seconds
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + 1);
    }, 28000);
    return () => clearInterval(interval);
  }, [visitorCount]);

  // Request browser geolocation
  const requestUserLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      showToast('Geolocation is not supported by your browser. Using city center.', 'warning');
      setUserLocation(DEFAULT_CITY_COORDINATES);
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setIsLocating(false);
          showToast('Live location detected! Distances updated.', 'success');
          resolve();
        },
        (error) => {
          setIsLocating(false);
          let msg = 'Could not access device location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied. Using downtown Metropolis coordinates.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location unavailable. Using downtown Metropolis coordinates.';
          }
          setLocationError(msg);
          setUserLocation(DEFAULT_CITY_COORDINATES);
          showToast(msg, 'info');
          resolve();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleBookmark = (type: 'market' | 'produce', targetId: string) => {
    const exists = bookmarks.some(b => b.targetId === targetId);
    if (exists) {
      setBookmarks(prev => prev.filter(b => b.targetId !== targetId));
      showToast(`Removed from your saved basket.`, 'info');
    } else {
      const newItem: BookmarkItem = {
        id: `bm-${Date.now()}`,
        type,
        targetId,
        addedAt: new Date().toISOString(),
        personalNotes: ''
      };
      setBookmarks(prev => [newItem, ...prev]);
      showToast(`Added to your eGreen Basket favorites!`, 'success');
    }
  };

  const isBookmarked = (type: 'market' | 'produce', targetId: string): boolean => {
    return bookmarks.some(b => b.type === type && b.targetId === targetId);
  };

  const updateBookmarkNote = (targetId: string, note: string) => {
    setBookmarks(prev =>
      prev.map(b => (b.targetId === targetId ? { ...b, personalNotes: note } : b))
    );
    showToast('Personal session note updated.', 'success');
  };

  const removeBookmark = (targetId: string) => {
    setBookmarks(prev => prev.filter(b => b.targetId !== targetId));
    showToast('Item removed from bookmarks.', 'info');
  };

  const navigateTo = (
    page: PageView,
    options?: {
      marketId?: string;
      produceId?: string;
      area?: string;
      day?: string;
      category?: string;
      query?: string;
    }
  ) => {
    setCurrentPage(page);
    if (options?.marketId !== undefined) {
      setSelectedMarketId(options.marketId);
    }
    if (options?.produceId !== undefined) {
      setSelectedProduceId(options.produceId);
    }
    if (options?.area !== undefined) {
      setActiveFilterNeighborhood(options.area);
    }
    if (options?.day !== undefined) {
      setActiveFilterDay(options.day);
    }
    if (options?.category !== undefined) {
      setActiveFilterCategory(options.category);
    }
    if (options?.query !== undefined) {
      setSearchQuery(options.query);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        selectedMarketId,
        selectedProduceId,
        markets,
        produceList,
        bookmarks,
        userLocation,
        isLocating,
        locationError,
        currentTime,
        visitorCount,
        authModalOpen,
        authModalMode,
        chatbotOpen,
        activeFilterNeighborhood,
        activeFilterDay,
        activeFilterCategory,
        searchQuery,
        toasts,
        navigateTo,
        setSelectedMarketId,
        setSelectedProduceId,
        toggleBookmark,
        isBookmarked,
        updateBookmarkNote,
        removeBookmark,
        requestUserLocation,
        openAuthModal,
        closeAuthModal,
        setChatbotOpen,
        setActiveFilterNeighborhood,
        setActiveFilterDay,
        setActiveFilterCategory,
        setSearchQuery,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
