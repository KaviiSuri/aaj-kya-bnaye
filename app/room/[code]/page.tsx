'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { MealScheduler } from '@/components/meal-scheduler';
import { WeeklySchedule } from '@/components/weekly-schedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storage } from '@/lib/supabase';
import { addToRoomHistory } from '@/lib/room-history';

export default function RoomPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [roomName, setRoomName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      try {
        const room = await storage.getRoom(params.code.toLowerCase());
        if (!room) {
          router.push('/');
          return;
        }
        setRoomName(room.name);
        addToRoomHistory(room.code, room.name);
      } catch (err) {
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    }
    loadRoom();
  }, [params.code, router]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <Header roomCode={params.code} roomName={roomName} />
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <MealScheduler roomCode={params.code} />
          </TabsContent>
          <TabsContent value="weekly">
            <WeeklySchedule roomCode={params.code} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
} 