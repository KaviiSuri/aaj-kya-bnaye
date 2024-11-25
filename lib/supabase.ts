import { createClient } from '@supabase/supabase-js';
import { DailySchedule, WeeklySchedule, createEmptyWeeklySchedule } from './meals';
import { Database } from './database.types';
import { format } from 'date-fns';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface Storage {
  getWeeklySchedule(date: Date): Promise<WeeklySchedule | null>;
  setWeeklySchedule(date: Date, schedule: WeeklySchedule): Promise<void>;
  getDailySchedule(date: Date): Promise<DailySchedule | null>;
  setDailySchedule(date: Date, schedule: DailySchedule): Promise<void>;
}

class SupabaseStorage implements Storage {
  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  private getDayOfWeek(date: Date): keyof WeeklySchedule {
    return format(date, 'EEEE').toLowerCase() as keyof WeeklySchedule;
  }

  async getWeeklySchedule(date: Date): Promise<WeeklySchedule | null> {
    const { data, error } = await supabase
      .from('schedules')
      .select('schedule')
      .eq('date', this.formatDate(date))
      .single();

    if (error || !data) return null;
    return data.schedule as unknown as WeeklySchedule;
  }

  async setWeeklySchedule(date: Date, schedule: WeeklySchedule): Promise<void> {
    const { error } = await supabase
      .from('schedules')
      .upsert({
        date: this.formatDate(date),
        schedule: schedule as unknown as Database['public']['Tables']['schedules']['Insert']['schedule'],
      }, {
        onConflict: 'date'
      });

    if (error) throw error;
  }

  async getDailySchedule(date: Date): Promise<DailySchedule | null> {
    const weeklySchedule = await this.getWeeklySchedule(date);
    if (!weeklySchedule) return null;

    const day = this.getDayOfWeek(date);
    return weeklySchedule[day];
  }

  async setDailySchedule(date: Date, schedule: DailySchedule): Promise<void> {
    const weeklySchedule = await this.getWeeklySchedule(date) || createEmptyWeeklySchedule();
    const day = this.getDayOfWeek(date);
    
    weeklySchedule[day] = schedule;
    await this.setWeeklySchedule(date, weeklySchedule);
  }
}

export const storage = new SupabaseStorage(); 