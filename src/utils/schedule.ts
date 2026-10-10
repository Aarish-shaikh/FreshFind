import { DayOfWeek, Market, Season } from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export function getCurrentDayName(date: Date = new Date()): DayOfWeek {
  return DAYS_OF_WEEK[date.getDay()];
}

export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0 to 11
  // March (2), April (3), May (4) -> Spring
  if (month >= 2 && month <= 4) return 'Spring';
  // June (5), July (6), August (7) -> Summer
  if (month >= 5 && month <= 7) return 'Summer';
  // September (8), October (9), November (10) -> Autumn
  if (month >= 8 && month <= 10) return 'Autumn';
  // December (11), January (0), February (1) -> Winter
  return 'Winter';
}

export interface MarketOpenStatus {
  isOpenNow: boolean;
  statusLabel: string;
  statusType: 'open' | 'closed';
  nextOpenNotice: string;
}

export function getMarketOpenStatus(market: Market, now: Date = new Date()): MarketOpenStatus {
  const todayName = getCurrentDayName(now);
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeMinutes = currentHours * 60 + currentMinutes;

  const todaySchedule = market.scheduleDetails.find(s => s.day === todayName);

  if (todaySchedule && todaySchedule.isOpen && todaySchedule.openTime && todaySchedule.closeTime) {
    const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
    const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);
    const openTimeMinutes = openH * 60 + openM;
    const closeTimeMinutes = closeH * 60 + closeM;

    if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
      return {
        isOpenNow: true,
        statusLabel: 'Open Now',
        statusType: 'open',
        nextOpenNotice: `Open today until ${formatTime12Hour(todaySchedule.closeTime)}`
      };
    }

    if (currentTimeMinutes < openTimeMinutes) {
      return {
        isOpenNow: false,
        statusLabel: 'Closed',
        statusType: 'closed',
        nextOpenNotice: `Opens today at ${formatTime12Hour(todaySchedule.openTime)}`
      };
    }
  }

  // Find next open day
  const todayIndex = now.getDay();
  let nextDayNotice = 'Check weekly schedule';

  for (let offset = 1; offset <= 7; offset++) {
    const checkDayIndex = (todayIndex + offset) % 7;
    const checkDayName = DAYS_OF_WEEK[checkDayIndex];
    const schedule = market.scheduleDetails.find(s => s.day === checkDayName);
    if (schedule && schedule.isOpen) {
      const dayLabel = offset === 1 ? 'Tomorrow' : checkDayName;
      nextDayNotice = `Next open: ${dayLabel} at ${formatTime12Hour(schedule.openTime)}`;
      break;
    }
  }

  return {
    isOpenNow: false,
    statusLabel: 'Closed',
    statusType: 'closed',
    nextOpenNotice: nextDayNotice
  };
}

export function formatTime12Hour(time24: string): string {
  if (!time24) return '';
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 becomes 12
  return `${h}:${m} ${ampm}`;
}

export function getNextOpenDayScore(market: Market, now: Date = new Date()): number {
  const status = getMarketOpenStatus(market, now);
  if (status.isOpenNow) return 0;

  const todayIndex = now.getDay();
  for (let offset = 1; offset <= 7; offset++) {
    const checkDayIndex = (todayIndex + offset) % 7;
    const checkDayName = DAYS_OF_WEEK[checkDayIndex];
    const sched = market.scheduleDetails.find(s => s.day === checkDayName);
    if (sched && sched.isOpen) {
      return offset;
    }
  }
  return 8;
}
