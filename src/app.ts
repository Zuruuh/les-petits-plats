import { RecipesProvider } from './scripts/providers/RecipesProvider';

async function main(): Promise<void> {
  const recipes = await RecipesProvider.all();

  console.log(recipes);
}

main().catch(console.error);

export {};
