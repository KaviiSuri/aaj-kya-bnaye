import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Copy, Check, Share2 } from 'lucide-react';
import ModeToggle from './mode-toggle';
import { useState } from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
  roomCode?: string;
  roomName?: string | null;
}

export function Header({ roomCode, roomName }: HeaderProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  const copyRoomCode = async () => {
    if (!roomCode) return;
    await navigator.clipboard.writeText(roomCode);
    setCopied('code');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyShareLink = async () => {
    if (!roomCode) return;
    const url = `${window.location.origin}/room/${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <header className="flex items-center justify-between pb-8">
      <div className="flex items-center gap-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">Aaj Kya Bnaye?</h1>
          {roomCode && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{roomName}</span>
              <span>•</span>
              <span>Room Code: {roomCode}</span>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={copyRoomCode}
                      >
                        {copied === 'code' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied === 'code' ? 'Copied!' : 'Copy room code'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={copyShareLink}
                      >
                        {copied === 'link' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied === 'link' ? 'Copied!' : 'Copy share link'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
      </div>
      <ModeToggle />
    </header>
  );
}
