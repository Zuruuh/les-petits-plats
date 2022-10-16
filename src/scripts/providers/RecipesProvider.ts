import type { Recipe } from '../models/Recipe';
import { Store } from '../components/Store';
import { DataLoader } from '../loaders/DataLoader';

export class RecipesProvider {
  private static STORE_KEY = 'recipes';

  public static async all(): Promise<Recipe[]> {
    if (!Store.has(RecipesProvider.STORE_KEY)) {
      Store.set(
        RecipesProvider.STORE_KEY,
        new DataLoader().load('/data/recipes.json'),
      );
    }

    return Store.get(RecipesProvider.STORE_KEY);
  }
}
