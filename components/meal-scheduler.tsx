'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateDailySchedule } from '@/lib/meals';
import { RefreshCw } from 'lucide-react';
import { MealDisplay } from '@/components/meal-display';

export function MealScheduler() {
  const [schedule, setSchedule] = useState(generateDailySchedule());

  const regenerateSchedule = () => {
    setSchedule(generateDailySchedule());
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Today's Schedule</CardTitle>
        <Button onClick={regenerateSchedule} size="icon" variant="ghost">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="main">Main Meals</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <MealDisplay schedule={schedule} view="all" />
          </TabsContent>

          <TabsContent value="breakfast">
            <MealDisplay schedule={schedule} view="breakfast" />
          </TabsContent>

          <TabsContent value="main">
            <MealDisplay schedule={schedule} view="main" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}