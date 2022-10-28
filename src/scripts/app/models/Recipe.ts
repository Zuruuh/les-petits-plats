import type { Ingredient } from './Ingredient';
import type { Ustensil } from './Ustensil';
import type { Appliance } from './Appliance';
import type { IdentifiableObject } from '../../base/types/Identifiable';

export interface Recipe extends IdentifiableObject {
  name: string;
  servings: number;
  ingredients: Ingredient[];
  time: number;
  description: string;
  appliance: Appliance;
  ustensils: Ustensil[];
}
