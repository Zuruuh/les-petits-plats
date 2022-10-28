import type { Ingredient } from './Ingredient';
import type { Ustensil } from './Ustensil';
import type { Appliance } from './Appliance';

export interface Recipe {
  id: number;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  time: number;
  description: string;
  appliance: Appliance;
  ustensils: Ustensil[];
}
