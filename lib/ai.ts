import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

const functions = getFunctions(app);

export interface AIFoodResult {
  name: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  confidence: string;
}

export interface AIWorkoutResult {
  name: string;
  description: string;
  duration: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
    notes?: string;
  }[];
  tips: string[];
}

export async function lookupFoodWithAI(
  query: string,
  servingSize?: string
): Promise<AIFoodResult | null> {
  try {
    const fn = httpsCallable(functions, 'lookupFoodNutrition');
    const result = await fn({ query, servingSize });
    const data = result.data as { success: boolean; data: AIFoodResult };
    if (data.success) return data.data;
    return null;
  } catch {
    return null;
  }
}

export async function suggestWorkoutWithAI(
  query: string,
  location?: string,
  experience?: string
): Promise<AIWorkoutResult | null> {
  try {
    const fn = httpsCallable(functions, 'suggestWorkout');
    const result = await fn({ query, location, experience });
    const data = result.data as { success: boolean; data: AIWorkoutResult };
    if (data.success) return data.data;
    return null;
  } catch {
    return null;
  }
}
