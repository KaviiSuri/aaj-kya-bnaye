import { createClient } from '@supabase/supabase-js';
import { DailySchedule, WeeklySchedule, createEmptyWeeklySchedule } from './meals';
import { Database } from './database.types';
import { format } from 'date-fns';
import {humanId} from 'human-id'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface Storage {
  getWeeklySchedule(date: Date, roomCode: string): Promise<WeeklySchedule | null>;
  setWeeklySchedule(date: Date, schedule: WeeklySchedule, roomCode: string): Promise<void>;
  getDailySchedule(date: Date, roomCode: string): Promise<DailySchedule | null>;
  setDailySchedule(date: Date, schedule: DailySchedule, roomCode: string): Promise<void>;
  createRoom(name: string): Promise<string>;
  getRoom(code: string): Promise<{ code: string; name: string } | null>;
}

class SupabaseStorage implements Storage {
  private formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  private getDayOfWeek(date: Date): keyof WeeklySchedule {
    return format(date, 'EEEE').toLowerCase() as keyof WeeklySchedule;
  }

  private generateRoomCode(): string {
    return humanId({
        separator: '-',
        capitalize: false,
    })
  }

  async createRoom(name: string): Promise<string> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      const code = this.generateRoomCode();
      const { error } = await supabase
        .from('rooms')
        .insert({ code, name });

      if (!error) {
        return code;
      }
      attempts++;
    }
    
    throw new Error('Failed to create room after multiple attempts');
  }

  async getRoom(code: string): Promise<{ code: string; name: string } | null> {
    const { data, error } = await supabase
      .from('rooms')
      .select('code, name')
      .eq('code', code.toLowerCase())
      .single();

    if (error || !data) return null;
    return data;
  }

  async getWeeklySchedule(date: Date, roomCode: string): Promise<WeeklySchedule | null> {
    const { data, error } = await supabase
      .from('schedules')
      .select('schedule')
      .eq('date', this.formatDate(date))
      .eq('room_code', roomCode)
      .single();

    if (error || !data) return null;
    return data.schedule as unknown as WeeklySchedule;
  }

  async setWeeklySchedule(date: Date, schedule: WeeklySchedule, roomCode: string): Promise<void> {
    const { error } = await supabase
      .from('schedules')
      .upsert({
        date: this.formatDate(date),
        schedule: schedule as unknown as Database['public']['Tables']['schedules']['Insert']['schedule'],
        room_code: roomCode
      }, {
        onConflict: 'date,room_code'
      });

    if (error) throw error;
  }

  async getDailySchedule(date: Date, roomCode: string): Promise<DailySchedule | null> {
    const weeklySchedule = await this.getWeeklySchedule(date, roomCode);
    if (!weeklySchedule) return null;

    const day = this.getDayOfWeek(date);
    return weeklySchedule[day];
  }

  async setDailySchedule(date: Date, schedule: DailySchedule, roomCode: string): Promise<void> {
    const weeklySchedule = await this.getWeeklySchedule(date, roomCode) || createEmptyWeeklySchedule();
    const day = this.getDayOfWeek(date);
    
    weeklySchedule[day] = schedule;
    await this.setWeeklySchedule(date, weeklySchedule, roomCode);
  }
}

export const storage = new SupabaseStorage(); 