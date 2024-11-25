import { WeeklySchedule, DailySchedule, createEmptyWeeklySchedule } from './meals';
import { startOfWeek, startOfDay, format, parseISO } from 'date-fns';

export interface Storage {
  // Weekly schedule methods
  getWeeklySchedule(date: Date): WeeklySchedule | null;
  setWeeklySchedule(date: Date, schedule: WeeklySchedule): void;
  
  // Daily schedule methods (derived from weekly)
  getDailySchedule(date: Date): DailySchedule | null;
  setDailySchedule(date: Date, schedule: DailySchedule): void;
}

class LocalStorage implements Storage {
  private readonly SCHEDULE_PREFIX = 'weekly-schedule';
  
  private getKey(date: Date): string {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    return `${this.SCHEDULE_PREFIX}-${format(weekStart, 'yyyy-MM-dd')}`;
  }

  private getDayOfWeek(date: Date): keyof WeeklySchedule {
    const day = format(date, 'EEEE').toLowerCase() as keyof WeeklySchedule;
    return day;
  }

  getWeeklySchedule(date: Date): WeeklySchedule | null {
    if (typeof window === 'undefined') return null;
    const key = this.getKey(date);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  setWeeklySchedule(date: Date, schedule: WeeklySchedule): void {
    if (typeof window === 'undefined') return;
    const key = this.getKey(date);
    localStorage.setItem(key, JSON.stringify(schedule));
  }

  getDailySchedule(date: Date): DailySchedule | null {
    const weeklySchedule = this.getWeeklySchedule(date);
    if (!weeklySchedule) return null;
    
    const dayOfWeek = this.getDayOfWeek(date);
    return weeklySchedule[dayOfWeek];
  }

  setDailySchedule(date: Date, schedule: DailySchedule): void {
    const weeklySchedule = this.getWeeklySchedule(date);
    const dayOfWeek = this.getDayOfWeek(date);
    
    const newWeeklySchedule: WeeklySchedule = weeklySchedule || createEmptyWeeklySchedule();
    newWeeklySchedule[dayOfWeek] = schedule;
    this.setWeeklySchedule(date, newWeeklySchedule);
  }
}

// Export a singleton instance
// export const storage = new LocalStorage(); 