import { Header } from '@/components/header';
import { MealScheduler } from '@/components/meal-scheduler';
import { WeeklySchedule } from '@/components/weekly-schedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <MealScheduler />
          </TabsContent>
          <TabsContent value="weekly">
            <WeeklySchedule />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}