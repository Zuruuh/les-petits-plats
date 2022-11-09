import type { Recipe } from '../models/Recipe';
import { Store } from '../../base/components/Store';
import { DataLoader } from '../../base/loaders/DataLoader';

export class RecipesProvider {
  private static STORE_KEY = 'recipes';

  public static async all(): Promise<Recipe[]> {
    if (!Store.has(RecipesProvider.STORE_KEY)) {
      Store.set(
        RecipesProvider.STORE_KEY,
        new DataLoader().load<Recipe[]>('/data/recipes.json'),
      );
    }

    return Store.get<Recipe[]>(RecipesProvider.STORE_KEY);
  }
}
