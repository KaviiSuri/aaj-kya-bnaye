import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface MealDisplayProps {
  schedule: {
    breakfast: { name: string };
    lunch: { name: string };
    dinner: { name: string };
    lunchAccompaniment: { name: string };
    dinnerAccompaniment: { name: string };
  };
  view: 'all' | 'breakfast' | 'main';
  onChangeMeal: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'lunchAccompaniment' | 'dinnerAccompaniment') => void;
}

export function MealDisplay({ schedule, view, onChangeMeal }: MealDisplayProps) {
  const renderMealWithAccompaniment = (
    title: string, 
    mainDish: string, 
    accompaniment: string,
    mainMealType: 'lunch' | 'dinner',
    accompanimentType: 'lunchAccompaniment' | 'dinnerAccompaniment'
  ) => (
    <div className="rounded-lg border p-4 space-y-2">
      <p className="text-sm font-medium leading-none">{title}</p>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Main Dish</p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onChangeMeal(mainMealType)}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm">{mainDish}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Accompaniment</p>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onChangeMeal(accompanimentType)}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm">{accompaniment}</p>
        </div>
      </div>
    </div>
  );

  const renderBreakfast = (name: string) => (
    <div className="rounded-lg border p-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-none">Breakfast</p>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => onChangeMeal('breakfast')}
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground pt-2">{name}</p>
      </div>
    </div>
  );

  if (view === 'breakfast') {
    return (
      <div className="space-y-4">
        {renderBreakfast(schedule.breakfast.name)}
      </div>
    );
  }

  if (view === 'main') {
    return (
      <div className="space-y-4">
        {renderMealWithAccompaniment('Lunch', schedule.lunch.name, schedule.lunchAccompaniment.name, 'lunch', 'lunchAccompaniment')}
        {renderMealWithAccompaniment('Dinner', schedule.dinner.name, schedule.dinnerAccompaniment.name, 'dinner', 'dinnerAccompaniment')}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {renderBreakfast(schedule.breakfast.name)}
      {renderMealWithAccompaniment('Lunch', schedule.lunch.name, schedule.lunchAccompaniment.name, 'lunch', 'lunchAccompaniment')}
      {renderMealWithAccompaniment('Dinner', schedule.dinner.name, schedule.dinnerAccompaniment.name, 'dinner', 'dinnerAccompaniment')}
    </div>
  );
}