'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type WeeklySchedule, type DailySchedule } from '@/lib/meals';
import { RefreshCw, CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { MealDisplay } from '@/components/meal-display';
import { useWeeklySchedule } from '@/hooks/use-schedule';
import { Skeleton } from '@/components/ui/skeleton';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CalendarPlus className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Schedule Generated</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Generate a meal schedule for this week to get started
      </p>
      <Button onClick={onGenerate}>
        <CalendarPlus className="h-4 w-4 mr-2" />
        Generate Week&apos;s Schedule
      </Button>
    </div>
  );
}

function EmptyDayState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CalendarPlus className="h-8 w-8 text-muted-foreground mb-3" />
      <h3 className="text-sm font-medium mb-2">No Schedule for This Day</h3>
      <Button onClick={onGenerate} size="sm">
        <CalendarPlus className="h-4 w-4 mr-2" />
        Generate Day&apos;s Schedule
      </Button>
    </div>
  );
}

export function WeeklySchedule() {
  const [currentDate, setCurrentDate] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState<keyof WeeklySchedule>('monday');

  const { 
    schedule, 
    isLoading,
    generateForWeek,
    regenerateWeek,
    regenerateDay,
    changeMeal,
  } = useWeeklySchedule(currentDate);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const formatTabDate = (dayIndex: number) => {
    const date = addDays(weekStart, dayIndex);
    return format(date, 'MMM d');
  };

  const nextWeek = () => setCurrentDate(date => addWeeks(date, 1));
  const previousWeek = () => setCurrentDate(date => subWeeks(date, 1));

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="text-2xl font-bold">Weekly Schedule</CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={previousWeek} size="icon" variant="ghost">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {schedule && (
            <Button onClick={() => regenerateWeek()} size="icon" variant="ghost">
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={nextWeek} size="icon" variant="ghost">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!schedule ? (
          <EmptyState onGenerate={() => generateForWeek()} />
        ) : (
          <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as keyof WeeklySchedule)}>
            <TabsList className="grid w-full h-fit grid-cols-7">
              {DAYS.map((day, index) => (
                <TabsTrigger key={day} value={day} className="flex flex-col gap-1">
                  <span className="capitalize">{day.slice(0, 3)}</span>
                  <span className="text-xs text-muted-foreground">{formatTabDate(index)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {DAYS.map(day => (
              <TabsContent key={day} value={day} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold capitalize">{day}</h3>
                  {schedule[day] && (
                    <Button 
                      onClick={() => regenerateDay(day)} 
                      variant="outline" 
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate Day
                    </Button>
                  )}
                </div>
                {schedule[day] ? (
                  <MealDisplay 
                    schedule={schedule[day]!} 
                    view="all"
                    onChangeMeal={(mealType) => changeMeal({ day, mealType })} 
                  />
                ) : (
                  <EmptyDayState onGenerate={() => regenerateDay(day)} />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
} 