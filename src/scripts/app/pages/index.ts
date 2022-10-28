import { RecipesProvider } from '../providers/RecipesProvider';
import { Search } from '../../base/search/Search';
import type { Recipe } from '../models/Recipe';
import type { FilterDataWithOptionProvider } from '../../base/components/Filter/types/FilterData';
import { FilterContainer } from '../../base/components/Filter/FilterContainer';
import { Filter } from '../../base/components/Filter/Filter';
import { ComponentRenderer } from '../../base/renderer/ComponentRenderer';

async function main(): Promise<void> {
  const recipes = await RecipesProvider.all();
  setupFilters(recipes);

  console.log(recipes);
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

function setupFilters(recipes: Recipe[]): void {
  const container = new FilterContainer(
    document.querySelector<HTMLElement>('#applied-filters')!,
    (filter: Filter) =>
      ComponentRenderer.reattachComponentToDom(
        document.querySelector<HTMLElement>('#filters')!,
        filter,
      ),
  );
  const searcher = new Search<Recipe>(
    recipes,
    FILTERS_DATA_WITH_PROVIDERS,
    container,
  );
  recipes = searcher.search("mais c'est quoi ce poulet");
}

main().catch(console.error);

export {};
