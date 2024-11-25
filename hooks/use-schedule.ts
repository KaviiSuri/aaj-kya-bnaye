'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storage } from '@/lib/storage';
import { generateWeeklySchedule, generateDailySchedule, regenerateDayInWeeklySchedule, regenerateMealInWeeklySchedule, type WeeklySchedule, type DailySchedule } from '@/lib/meals';
import { startOfWeek, startOfDay } from 'date-fns';

// Query keys
export const scheduleKeys = {
  all: ['schedule'] as const,
  weekly: (date: Date) => [...scheduleKeys.all, 'weekly', date] as const,
  daily: (date: Date) => [...scheduleKeys.all, 'daily', date] as const,
};

// Weekly schedule hooks
export function useWeeklySchedule(date: Date) {
  const queryClient = useQueryClient();
  const normalizedDate = startOfWeek(date, { weekStartsOn: 1 });

  const { data: schedule, isLoading } = useQuery({
    queryKey: scheduleKeys.weekly(normalizedDate),
    queryFn: () => storage.getWeeklySchedule(normalizedDate),
  });

  const { mutate: generateForWeek } = useMutation({
    mutationFn: async () => {
      const newSchedule = generateWeeklySchedule();
      storage.setWeeklySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
    onSuccess: (newSchedule) => {
      queryClient.setQueryData(scheduleKeys.weekly(normalizedDate), newSchedule);
      // Invalidate any daily queries that fall within this week
      for (let i = 0; i < 7; i++) {
        const date = new Date(normalizedDate);
        date.setDate(date.getDate() + i);
        queryClient.invalidateQueries({ queryKey: scheduleKeys.daily(date) });
      }
    },
  });

  const { mutate: regenerateWeek } = useMutation({
    mutationFn: async () => {
      const newSchedule = generateWeeklySchedule();
      storage.setWeeklySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
  });

  const { mutate: regenerateDay } = useMutation({
    mutationFn: async (day: keyof WeeklySchedule) => {
      if (!schedule) return null;
      const newSchedule = regenerateDayInWeeklySchedule(schedule, day);
      storage.setWeeklySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
    onSuccess: (newSchedule) => {
      if (newSchedule) {
        queryClient.setQueryData(scheduleKeys.weekly(normalizedDate), newSchedule);
      }
    },
  });

  const { mutate: changeMeal } = useMutation({
    mutationFn: async ({ day, mealType }: { day: keyof WeeklySchedule; mealType: keyof DailySchedule }) => {
      if (!schedule) return null;
      const newSchedule = regenerateMealInWeeklySchedule(schedule, day, mealType);
      storage.setWeeklySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
    onSuccess: (newSchedule) => {
      if (newSchedule) {
        queryClient.setQueryData(scheduleKeys.weekly(normalizedDate), newSchedule);
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
export function useDailySchedule(date: Date) {
  const queryClient = useQueryClient();
  const normalizedDate = startOfDay(date);

  const { data: schedule, isLoading } = useQuery({
    queryKey: scheduleKeys.daily(normalizedDate),
    queryFn: () => storage.getDailySchedule(normalizedDate),
  });

  const { mutate: generateForDay } = useMutation({
    mutationFn: async () => {
      const newSchedule = generateDailySchedule();
      storage.setDailySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
    onSuccess: (newSchedule) => {
      queryClient.setQueryData(scheduleKeys.daily(normalizedDate), newSchedule);
      // Invalidate the weekly query that contains this day
      const weekStart = startOfWeek(normalizedDate, { weekStartsOn: 1 });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly(weekStart) });
    },
  });

  const { mutate: regenerateSchedule } = useMutation({
    mutationFn: async () => {
      const newSchedule = generateDailySchedule();
      storage.setDailySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
  });

  const { mutate: changeMeal } = useMutation({
    mutationFn: async (mealType: keyof DailySchedule) => {
      if (!schedule) return Promise.reject('No schedule exists');
      const newSchedule = {
        ...schedule,
        [mealType]: mealType === 'breakfast' 
          ? generateDailySchedule().breakfast
          : mealType.includes('Accompaniment') 
            ? generateDailySchedule().lunchAccompaniment
            : generateDailySchedule().lunch
      };
      storage.setDailySchedule(normalizedDate, newSchedule);
      return newSchedule;
    },
    onSuccess: (newSchedule) => {
      queryClient.setQueryData(scheduleKeys.daily(normalizedDate), newSchedule);
      const weekStart = startOfWeek(normalizedDate, { weekStartsOn: 1 });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly(weekStart) });
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