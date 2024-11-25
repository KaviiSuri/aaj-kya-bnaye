'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { storage } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!roomCode) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const room = await storage.getRoom(roomCode.toLowerCase());
      if (!room) {
        setError('Room not found');
        return;
      }
      router.push(`/room/${room.code}`);
    } catch (err) {
      setError('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const code = await storage.createRoom(roomName);
      router.push(`/room/${code}`);
    } catch (err) {
      setError('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 grid place-items-center min-h-screen">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Join Room</CardTitle>
            <CardDescription>Enter a room code to join an existing meal planning room</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomCode">Room Code</Label>
              <Input
                id="roomCode"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleJoinRoom}
              disabled={!roomCode || isLoading}
            >
              Join Room
            </Button>
          </CardContent>
        </Card>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Room</CardTitle>
            <CardDescription>Create a new meal planning room to share with others</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleCreateRoom}
              disabled={!roomName || isLoading}
            >
              Create Room
            </Button>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </main>
  );
}