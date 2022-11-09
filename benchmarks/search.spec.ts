import { expect, test } from '@playwright/test';
import type { Recipe } from '../src/scripts/app/models/Recipe';

test('Run search benchmarks', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const {
    ranFor: ranForMs,
    foundItems: totalFoundItems,
    ITERATIONS: iterations,
    query: usedQuery,
  } = await page.evaluate(async () => {
    const { Search } = await import('../src/scripts/base/search/Search');
    const { RecipesProvider } = await import(
      '../src/scripts/app/providers/RecipesProvider'
    );
    const { FILTERS_DATA_WITH_PROVIDERS } = await import(
      '../src/scripts/app/pages/index/filtersData'
    );
    const { FilterContainer } = await import(
      '../src/scripts/base/components/Filter/FilterContainer'
    );

    const container = new FilterContainer(
      document.createElement('div'),
      () => /* Do nothing on purpose to prevent re-renders */ null,
    );

    const search = new Search<Recipe>(
      await RecipesProvider.all(),
      FILTERS_DATA_WITH_PROVIDERS,
      container,
      (recipe: Recipe) => [
        recipe.name,
        recipe.description,
        ...recipe.ingredients.map(({ ingredient }) => ingredient),
      ],
    );

    const startedAt = Date.now();

    const ITERATIONS = 100_000;
    let foundItems = 0;
    const query = 'lait coco';

    for (let i = 0; i < ITERATIONS; i++) {
      foundItems += search.search(query).length;
    }

    return {
      ranFor: Date.now() - startedAt,
      foundItems,
      ITERATIONS,
      query,
    };
  });

  console.log(
    `Search algorithm ran for ${ranForMs}ms, found a total of ${totalFoundItems} recipes for query ${usedQuery}, for a total of ${iterations} simulations!`,
  );

  expect(true).toBe(true);
});
