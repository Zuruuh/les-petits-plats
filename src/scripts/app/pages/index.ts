import { RecipesProvider } from '../providers/RecipesProvider';
import { Search } from '../../base/search/Search';
import type { Recipe } from '../models/Recipe';
import type { FilterDataWithOptionProvider } from '../../base/components/Filter/types/FilterData';
import { FilterContainer } from '../../base/components/Filter/FilterContainer';
import { Filter } from '../../base/components/Filter/Filter';
import { ComponentRenderer } from '../../base/renderer/ComponentRenderer';
import { RecipeCard } from '../templates/RecipeCard';

async function main(): Promise<void> {
  const recipes = await RecipesProvider.all();
  const recipesContainer =
    document.querySelector<HTMLDivElement>('#recipes > div')!;
  const searchInput =
    document.querySelector<HTMLInputElement>('#searchbar > input')!;

  recipesContainer.innerHTML = '';

  for (const recipe of recipes) {
    const card = new RecipeCard(recipe).render();
    recipesContainer.appendChild(card);
  }

  const searcher = setupFilters(recipes);
  searchInput.addEventListener('input', (e: Event) => {
    searcher.search((e.currentTarget as HTMLInputElement).value);

    searcher.subscribeForPageLifecycle((observable) => {
      recipesContainer.innerHTML = '';

      for (const recipe of observable.current) {
        const card = new RecipeCard(recipe).render();
        recipesContainer.appendChild(card);
      }
    });
  });
}

const FILTERS_DATA_WITH_PROVIDERS: FilterDataWithOptionProvider<Recipe>[] = [
  {
    label: 'Ingrédients',
    color: '#3282f7',
    inputPlaceholder: 'Rechercher un ingrédient',
    optionProvider: (recipe) =>
      recipe.ingredients.map(({ ingredient }) => ingredient),
  },
  {
    label: 'Appareils',
    color: '#68d9a4',
    inputPlaceholder: 'Rechercher un appareil',
    optionProvider: (recipe) => recipe.appliance,
  },
  {
    label: 'Ustensiles',
    color: '#ed6454',
    inputPlaceholder: 'Rechercher un ustensile',
    optionProvider: (recipe) => recipe.ustensils,
  },
];

function setupFilters(recipes: Recipe[]): Search<Recipe> {
  const container = new FilterContainer(
    document.querySelector<HTMLElement>('#applied-filters')!,
    (filter: Filter) =>
      ComponentRenderer.reattachComponentToDom(
        document.querySelector<HTMLElement>('#filters')!,
        filter,
      ),
  );
  return new Search<Recipe>(
    recipes,
    FILTERS_DATA_WITH_PROVIDERS,
    container,
    (recipe: Recipe) => [
      recipe.name,
      recipe.description,
      ...recipe.ingredients.map(({ ingredient }) => ingredient),
    ],
  );
}

main().catch(console.error);

export {};
