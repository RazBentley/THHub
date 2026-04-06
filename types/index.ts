export type UserRole = 'owner' | 'client';

export interface OnboardingInfo {
  mainGoal?: string;
  motivation?: string;
  experience?: string;
  trainingDays?: string;
  healthConditions?: string;
  dietaryRequirements?: string;
  additionalNotes?: string;
  completedAt?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  checkInDay: string; // e.g. 'Monday', 'Tuesday', etc.
  fcmToken?: string;
  createdAt: number;
  photoURL?: string;
  onboarding?: OnboardingInfo;
}

export interface Subscription {
  status: 'active' | 'inactive' | 'past_due' | 'cancelled';
  stripeCustomerId?: string;
  currentPeriodEnd?: number;
  plan: string;
  amount: number; // in pence (5000 = £50)
}

export interface FoodEntry {
  id: string;
  foodName: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  quantity: number;
  timestamp: number;
}

export interface DailyFoodLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Chat {
  id: string;
  participants: string[]; // [ownerUid, clientUid]
  clientName: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDuration?: number; // seconds
  timestamp: number;
  read: boolean;
}

export interface MealItem {
  label: string; // "M1", "M2", etc.
  items: string[]; // ["Porridge oats 50g", "1 scoop whey protein", ...]
  note?: string; // "Mixed with water not milk"
  estimatedCalories?: number; // total kcal for this meal
  estimatedProtein?: number;
  estimatedCarbs?: number;
  estimatedFat?: number;
}

export interface MealPlan {
  freeCalories: number;
  waterTargetLitres: number; // e.g. 3, 4, 6
  meals: MealItem[];
  optionalSnack?: string;
  notes: string[];
  supplements: string[];
  updatedAt: number;
}

export interface ExtraFoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  mealLabel?: string; // which meal it was added to, or 'extra' for standalone
}

export interface DailyProgress {
  mealsCompleted: boolean[];
  waterGlasses: number; // each glass = 375ml, 8 = 3L
  extras: ExtraFoodItem[];
  completedAt?: number;
}

export interface WeeklyCheckIn {
  submittedAt: number;
  weekId: string; // YYYY-WW
  weightCurrent: string;
  weightPrevious: string;
  goal: string;
  sleep: string;
  appetite: string;
  energy: string;
  stress: string;
  gymPerformance: string;
  recovery: string;
  sessionsCompleted: boolean;
  cardio: string;
  steps: string;
  adherence: string;
  cheatMeal: string;
  questions: string;
  otherNotes: string;
  wins: string;
  goalsNextWeek: string;
  frontPhotoUrl?: string;
  sidePhotoUrl?: string;
  backPhotoUrl?: string;
}

// Cardio & Steps
export interface DailyCardio {
  date: string;
  cardioMinutes: number;
  cardioType: string; // 'walking', 'running', 'cycling', 'incline walk', 'other'
  steps: number;
  notes?: string;
}

// Workout Programmes
export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string; // "10" or "8-12" or "AMRAP"
  restSeconds: number;
  notes?: string; // "superset with next" etc
}

export interface WorkoutDay {
  label: string; // "Push", "Pull", "Legs", "Day 1" etc
  exercises: WorkoutExercise[];
}

export interface WorkoutProgramme {
  name: string; // "4-Day Push Pull Legs"
  days: WorkoutDay[];
  notes: string[];
  updatedAt: number;
}

export interface ExerciseLog {
  weight?: string;
  notes?: string;
}

export interface WorkoutProgress {
  date: string;
  dayLabel: string;
  exercisesCompleted: boolean[];
  exerciseLogs?: ExerciseLog[];
  completedAt?: number;
}

// Goals
export interface WeightGoal {
  targetWeight: string; // "13st" or "82kg"
  targetDate: string; // "2026-06-01"
  startWeight: string;
  startDate: string;
  unit: 'st' | 'kg';
}

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  brands?: string;
  nutriments: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    'energy-kcal_serving'?: number;
    proteins_serving?: number;
    carbohydrates_serving?: number;
    fat_serving?: number;
  };
  serving_size?: string;
  image_url?: string;
}
