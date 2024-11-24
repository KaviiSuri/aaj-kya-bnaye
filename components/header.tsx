import { Utensils } from 'lucide-react';

export function Header() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
        <Utensils className="h-8 w-8" />
        Aaj Kya Banaye?
      </h1>
      <p className="text-muted-foreground">
        Generate your perfect meal schedule
      </p>
    </div>
  );
}
