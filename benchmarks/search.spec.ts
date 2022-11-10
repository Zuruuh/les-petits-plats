import { expect, test } from '@playwright/test';
import type { Recipe } from '../src/scripts/app/models/Recipe';

test('Run search benchmarks', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const {
    ranFor: ranForMs,
    foundItems: totalFoundItems,
    ITERATIONS: iterations,
    query: usedQuery,
    min: minTime,
    max: maxTime,
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

    const ITERATIONS = 100_000;
    let foundItems = 0;
    const query = 'lait coco';
    const AVERAGE_OF = 15;

    let [min, max] = [999999999999999, 0];
    const results = [];

    for (let i = 0; i < AVERAGE_OF; i++) {
      let start = Date.now();
      for (let j = 0; j < ITERATIONS; j++) {
        foundItems += search.search(query).length;
      }

      const time = Date.now() - start;
      results.push(time);
      min = Math.min(min, time);
      max = Math.max(max, time);
    }

    foundItems /= AVERAGE_OF;

    return {
      ranFor: results.reduce((prev, curr) => prev + curr, 0) / results.length,
      foundItems,
      ITERATIONS,
      query,
      AVERAGE_OF,
      min,
      max,
    };
  });

  console.log(
    `Search algorithm ran for an average of ${ranForMs}ms,\n` +
      `found a total of ${totalFoundItems} recipes for query "${usedQuery}",\n` +
      `for a total of ${iterations} simulations!\n` +
      `Min: ${minTime}\n` +
      `Max: ${maxTime}`,
  );

  expect(true).toBe(true);
});
