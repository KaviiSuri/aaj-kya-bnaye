'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CalendarPlus } from 'lucide-react';
import { MealDisplay } from '@/components/meal-display';
import { useDailySchedule } from '@/hooks/use-schedule';
import { Skeleton } from '@/components/ui/skeleton';
import { format, startOfDay } from 'date-fns';

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
        Generate a meal schedule for this day to get started
      </p>
      <Button onClick={onGenerate}>
        <CalendarPlus className="h-4 w-4 mr-2" />
        Generate Daily Schedule
      </Button>
    </div>
  );
}

export function MealScheduler() {
  const [currentDate] = useState<Date>(() => startOfDay(new Date()));
  const { 
    schedule, 
    isLoading,
    generateForDay,
    regenerateSchedule,
    changeMeal,
  } = useDailySchedule(currentDate);

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Daily Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-4">
          <CardTitle className="text-2xl font-bold">Daily Schedule</CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(currentDate, 'MMMM d, yyyy')}
          </div>
        </div>
        {schedule && (
          <Button onClick={() => regenerateSchedule()} size="icon" variant="ghost">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!schedule ? (
          <EmptyState onGenerate={() => generateForDay()} />
        ) : (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full h-fit grid-cols-3">
              <TabsTrigger value="all">All Meals</TabsTrigger>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="main">Main Meals</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <MealDisplay schedule={schedule} view="all" onChangeMeal={changeMeal} />
            </TabsContent>

            <TabsContent value="breakfast">
              <MealDisplay schedule={schedule} view="breakfast" onChangeMeal={changeMeal} />
            </TabsContent>

            <TabsContent value="main">
              <MealDisplay schedule={schedule} view="main" onChangeMeal={changeMeal} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}