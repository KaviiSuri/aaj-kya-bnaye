export type MealCategory = 'DINNER/LUNCH' | 'BREAKFAST' | 'SALAD/ACCOMPANIMENT';

export interface Meal {
  name: string;
  category: MealCategory;
}

export interface DailySchedule {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  lunchAccompaniment: Meal;
  dinnerAccompaniment: Meal;
}

export interface WeeklySchedule {
  monday: DailySchedule | null;
  tuesday: DailySchedule | null;
  wednesday: DailySchedule | null;
  thursday: DailySchedule | null;
  friday: DailySchedule | null;
  saturday: DailySchedule | null;
  sunday: DailySchedule | null;
}

export const createEmptyWeeklySchedule = (): WeeklySchedule => ({
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
});

export const meals: Meal[] = [
  // Dinner/Lunch items
  { name: 'Bhindi', category: 'DINNER/LUNCH' },
  { name: 'Matar Paneer', category: 'DINNER/LUNCH' },
  { name: 'Butter Paneer', category: 'DINNER/LUNCH' },
  { name: 'Palak Paneer', category: 'DINNER/LUNCH' },
  { name: 'Rajma Chawal', category: 'DINNER/LUNCH' },
  { name: 'Chole Chawal', category: 'DINNER/LUNCH' },
  { name: 'Dal Tadka', category: 'DINNER/LUNCH' },
  { name: 'Dal Makhani', category: 'DINNER/LUNCH' },
  { name: 'Baingan Bharta', category: 'DINNER/LUNCH' },
  { name: 'Aloo Matar', category: 'DINNER/LUNCH' },
  { name: 'Kadhi Pakora', category: 'DINNER/LUNCH' },
  { name: 'Aloo Paratha', category: 'DINNER/LUNCH' },
  { name: 'Methi Aloo', category: 'DINNER/LUNCH' },
  { name: 'Chana Dal', category: 'DINNER/LUNCH' },
  { name: 'Besan ki Sabzi', category: 'DINNER/LUNCH' },
  { name: 'Chilli Paneer', category: 'DINNER/LUNCH' },
  { name: 'Veg Fried Rice', category: 'DINNER/LUNCH' },
  { name: 'Chilli Potato', category: 'DINNER/LUNCH' },
  { name: 'Chilli Chicken', category: 'DINNER/LUNCH' },
  { name: 'Pav Bhaji', category: 'DINNER/LUNCH' },
  { name: 'Idli Sambhar', category: 'DINNER/LUNCH' },
  { name: 'Dosa Sambhar', category: 'DINNER/LUNCH' },
  { name: 'Chane Chawal', category: 'DINNER/LUNCH' },
  { name: 'Paneer Pulao', category: 'DINNER/LUNCH' },
  { name: 'Kadhai Paneer', category: 'DINNER/LUNCH' },
  { name: 'Jeera Aloo', category: 'DINNER/LUNCH' },

  // Breakfast items
  { name: 'Oats', category: 'BREAKFAST' },
  { name: 'Paneer Sandwich', category: 'BREAKFAST' },
  { name: 'Poha (Peanut Heavy)', category: 'BREAKFAST' },
  { name: 'Cheese Sandwich', category: 'BREAKFAST' },
  { name: 'Pizza Sandwich', category: 'BREAKFAST' },
  { name: 'Omelette', category: 'BREAKFAST' },
  { name: 'Boiled Eggs', category: 'BREAKFAST' },
  { name: 'Pan Cakes', category: 'BREAKFAST' },
  { name: 'Besan Cheela', category: 'BREAKFAST' },
  { name: 'Suji Cheela', category: 'BREAKFAST' },
  { name: 'Aloo Methi Parathe', category: 'BREAKFAST' },
  { name: 'Dal k Parathe', category: 'BREAKFAST' },
  { name: 'Paneer k Parathe', category: 'BREAKFAST' },
  { name: 'Aloo Parathe', category: 'BREAKFAST' },

  // Salad/Accompaniment items
  { name: 'Boondi Raita', category: 'SALAD/ACCOMPANIMENT' },
  { name: 'Chickpea Salad', category: 'SALAD/ACCOMPANIMENT' },
  { name: 'Papad', category: 'SALAD/ACCOMPANIMENT' },
  { name: 'Sprouts', category: 'SALAD/ACCOMPANIMENT' },
  { name: 'Fiyums', category: 'SALAD/ACCOMPANIMENT' },
];

export function getRandomMeal(category: MealCategory): Meal {
  const categoryMeals = meals.filter((meal) => meal.category === category);
  const randomIndex = Math.floor(Math.random() * categoryMeals.length);
  return categoryMeals[randomIndex];
}

export function generateDailySchedule() {
  const lunchAccompaniment = getRandomMeal('SALAD/ACCOMPANIMENT');
  const dinnerAccompaniment = getRandomMeal('SALAD/ACCOMPANIMENT');
  
  return {
    breakfast: getRandomMeal('BREAKFAST'),
    lunch: getRandomMeal('DINNER/LUNCH'),
    dinner: getRandomMeal('DINNER/LUNCH'),
    lunchAccompaniment,
    dinnerAccompaniment,
  };
}

export function generateWeeklySchedule(): WeeklySchedule {
  return {
    monday: generateDailySchedule(),
    tuesday: generateDailySchedule(),
    wednesday: generateDailySchedule(),
    thursday: generateDailySchedule(),
    friday: generateDailySchedule(),
    saturday: generateDailySchedule(),
    sunday: generateDailySchedule(),
  };
}

export function regenerateDayInWeeklySchedule(schedule: WeeklySchedule, day: keyof WeeklySchedule): WeeklySchedule {
  const newSchedule = { ...schedule };
  const daySchedule: DailySchedule = {
    breakfast: getRandomMeal('BREAKFAST'),
    lunch: getRandomMeal('DINNER/LUNCH'),
    dinner: getRandomMeal('DINNER/LUNCH'),
    lunchAccompaniment: getRandomMeal('SALAD/ACCOMPANIMENT'),
    dinnerAccompaniment: getRandomMeal('SALAD/ACCOMPANIMENT'),
  };
  newSchedule[day] = daySchedule;
  return newSchedule;
}

export function regenerateMealInWeeklySchedule(
  schedule: WeeklySchedule,
  day: keyof WeeklySchedule,
  mealType: keyof DailySchedule
): WeeklySchedule {
  const newSchedule = { ...schedule };
  const currentDay = schedule[day];
  if (!currentDay) return schedule;

  const newDay = { ...currentDay };
  newDay[mealType] = mealType === 'breakfast' 
    ? getRandomMeal('BREAKFAST')
    : mealType.includes('Accompaniment') 
      ? getRandomMeal('SALAD/ACCOMPANIMENT')
      : getRandomMeal('DINNER/LUNCH');

  newSchedule[day] = newDay;
  return newSchedule;
}