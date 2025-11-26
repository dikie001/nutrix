// Food content
export type FoodCategory = "carb" | "protein" | "fat" | "vitamin" | "supplement" | "snack";

// Reason to take the food
export type UseCase =
  | "pre_workout"
  | "post_workout"
  | "recovery"
  | "energy_boost"
  | "immune_support";

//   Food as a whole
export interface Food {
  id: number;
  name: string;
  type: FoodCategory;
  servingGrams: number;
  calories: number;
  protein: number;
  fat: number;
  useCase: UseCase;
  athleteBenefit: string;
}