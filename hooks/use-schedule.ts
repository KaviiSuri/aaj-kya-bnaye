'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/storage';
import { generateWeeklySchedule, generateDailySchedule, regenerateDayInWeeklySchedule, regenerateMealInWeeklySchedule, type WeeklySchedule, type DailySchedule } from '@/lib/meals';
import { startOfWeek, startOfDay } from 'date-fns';

// Query keys
export const scheduleKeys = {
  all: ['schedule'] as const,
  weekly: (date: Date) => [...scheduleKeys.all, 'weekly', startOfWeek(date, { weekStartsOn: 1 })] as const,
  daily: (date: Date) => [...scheduleKeys.all, 'daily', startOfDay(date)] as const,
};

// Weekly schedule hooks
export function useWeeklySchedule(currentDate: Date) {
  const queryClient = useQueryClient();
  const normalizedDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const { data: schedule, isLoading } = useQuery({
    queryKey: scheduleKeys.weekly(normalizedDate),
    queryFn: () => storage.getWeeklySchedule(normalizedDate),
  });

  const { mutate: generateForWeek } = useMutation({
    mutationFn: async (date: Date = normalizedDate) => {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const newSchedule = generateWeeklySchedule();
      await storage.setWeeklySchedule(weekStart, newSchedule);
      return { schedule: newSchedule, date: weekStart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(scheduleKeys.weekly(data.date), data.schedule);
      // Invalidate any daily queries that fall within this week
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(data.date);
        dayDate.setDate(dayDate.getDate() + i);
        queryClient.invalidateQueries({ queryKey: scheduleKeys.daily(dayDate) });
      }
    },
  });

  const { mutate: regenerateWeek } = useMutation({
    mutationFn: async (date: Date = normalizedDate) => {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const newSchedule = generateWeeklySchedule();
      await storage.setWeeklySchedule(weekStart, newSchedule);
      return { schedule: newSchedule, date: weekStart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(scheduleKeys.weekly(data.date), data.schedule);
    },
  });

  const { mutate: regenerateDay } = useMutation({
    mutationFn: async ({ date = normalizedDate, day }: { date?: Date; day: keyof WeeklySchedule }) => {
      if (!schedule) return null;
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const newSchedule = regenerateDayInWeeklySchedule(schedule, day);
      await storage.setWeeklySchedule(weekStart, newSchedule);
      return { schedule: newSchedule, date: weekStart };
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(scheduleKeys.weekly(data.date), data.schedule);
      }
    },
  });

  const { mutate: changeMeal } = useMutation({
    mutationFn: async ({ date = normalizedDate, day, mealType }: { date?: Date; day: keyof WeeklySchedule; mealType: keyof DailySchedule }) => {
      if (!schedule) return null;
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const newSchedule = regenerateMealInWeeklySchedule(schedule, day, mealType);
      await storage.setWeeklySchedule(weekStart, newSchedule);
      return { schedule: newSchedule, date: weekStart };
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(scheduleKeys.weekly(data.date), data.schedule);
      }
    },
  });

  return {
    schedule,
    isLoading,
    generateForWeek,
    regenerateWeek,
    regenerateDay,
    changeMeal,
  };
}

// Daily schedule hooks
export function useDailySchedule(currentDate: Date) {
  const queryClient = useQueryClient();
  const normalizedDate = startOfDay(currentDate);

  const { data: schedule, isLoading } = useQuery({
    queryKey: scheduleKeys.daily(normalizedDate),
    queryFn: () => storage.getDailySchedule(normalizedDate),
  });

  const { mutate: generateForDay } = useMutation({
    mutationFn: async (date: Date = normalizedDate) => {
      const dayStart = startOfDay(date);
      const newSchedule = generateDailySchedule();
      await storage.setDailySchedule(dayStart, newSchedule);
      return { schedule: newSchedule, date: dayStart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(scheduleKeys.daily(data.date), data.schedule);
      // Invalidate the weekly query that contains this day
      const weekStart = startOfWeek(data.date, { weekStartsOn: 1 });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly(weekStart) });
    },
  });

  const { mutate: regenerateSchedule } = useMutation({
    mutationFn: async (date: Date = normalizedDate) => {
      const dayStart = startOfDay(date);
      const newSchedule = generateDailySchedule();
      await storage.setDailySchedule(dayStart, newSchedule);
      return { schedule: newSchedule, date: dayStart };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(scheduleKeys.daily(data.date), data.schedule);
      const weekStart = startOfWeek(data.date, { weekStartsOn: 1 });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly(weekStart) });
    },
  });

  const { mutate: changeMeal } = useMutation({
    mutationFn: async ({ date = normalizedDate, mealType }: { date?: Date; mealType: keyof DailySchedule }) => {
      if (!schedule) return null;
      const dayStart = startOfDay(date);
      const newSchedule = {
        ...schedule,
        [mealType]: mealType === 'breakfast' 
          ? generateDailySchedule().breakfast
          : mealType.includes('Accompaniment') 
            ? generateDailySchedule().lunchAccompaniment
            : generateDailySchedule().lunch
      };
      await storage.setDailySchedule(dayStart, newSchedule);
      return { schedule: newSchedule, date: dayStart };
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(scheduleKeys.daily(data.date), data.schedule);
        const weekStart = startOfWeek(data.date, { weekStartsOn: 1 });
        queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly(weekStart) });
      }
    },
  });

  return {
    schedule,
    isLoading,
    generateForDay,
    regenerateSchedule,
    changeMeal,
  };
} 