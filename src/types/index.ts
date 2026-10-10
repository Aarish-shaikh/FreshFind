export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-Round';

export type ProduceCategory = 'Vegetables' | 'Fruits' | 'Herbs & Greens' | 'Dairy & Eggs' | 'Artisanal & Bakery' | 'Honey & Preserves';

export interface MarketScheduleDay {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string; // e.g. "08:00"
  closeTime: string; // e.g. "14:00"
  displayHours: string; // e.g. "8:00 AM – 2:00 PM"
}

export interface Market {
  id: string;
  name: string;
  tagline: string;
  area: string; // Neighborhood / district
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  operatingDays: DayOfWeek[];
  scheduleDetails: MarketScheduleDay[];
  produceCategories: ProduceCategory[];
  featuredProduceIds: string[];
  amenities: {
    parking: string;
    dogFriendly: boolean;
    snapEbt: boolean;
    restrooms: boolean;
    wheelchairAccessible: boolean;
    liveMusic: boolean;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    manager: string;
  };
  isFeatured?: boolean;
}

export interface ProduceItem {
  id: string;
  name: string;
  category: ProduceCategory;
  description: string;
  season: Season[];
  peakMonths: string[];
  icon: string;
  image: string;
  nutritionalHighlights: string[];
  storageTips: string;
  marketIds: string[]; // Market IDs where available
}

export interface BookmarkItem {
  id: string;
  type: 'market' | 'produce';
  targetId: string;
  addedAt: string;
  personalNotes?: string;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  actionLink?: {
    label: string;
    page: PageView;
    targetId?: string;
  };
}

export type PageView = 
  | 'home'
  | 'directory'
  | 'market-detail'
  | 'produce-guide'
  | 'seasonal'
  | 'bookmarks'
  | 'contact'
  | 'about';
