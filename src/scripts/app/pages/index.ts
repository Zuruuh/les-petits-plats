import { RecipesProvider } from '../providers/RecipesProvider';
import { Filter } from '../../base/components/Filter/Filter';
import { ComponentRenderer } from '../../base/renderer/ComponentRenderer';
import { FilterContainer } from '../../base/components/Filter/FilterContainer';
import type { Recipe } from '../models/Recipe';
import type { HexColor } from '../../base/types/HexColor';

async function main(): Promise<void> {
  const recipes = await RecipesProvider.all();
  setupFilters(recipes);

  console.log(recipes);
}

interface FilterData {
  label: string;
  color: HexColor;
  inputPlaceholder: string;
  options: string[];
}

const FILTERS_DATA_OPTIONLESS: (Omit<FilterData, 'options'> & {
  optionProvider: (recipes: Recipe[]) => string[];
})[] = [
  {
    label: 'Ingrédients',
    color: '#3282f7',
    inputPlaceholder: 'Rechercher un ingrédient',
    optionProvider: (recipes) =>
      recipes.reduce<string[]>(
        (options, recipe): string[] => [
          ...options,
          ...recipe.ingredients.map(({ ingredient }) => ingredient),
        ],
        [],
      ),
  },
  {
    label: 'Appareils',
    color: '#68d9a4',
    inputPlaceholder: 'Rechercher un appareil',
    optionProvider: (recipes) => recipes.map(({ appliance }) => appliance),
  },
  {
    label: 'Ustensiles',
    color: '#ed6454',
    inputPlaceholder: 'Rechercher un ustensile',
    optionProvider: (recipes) =>
      recipes.reduce<string[]>(
        (ustensils, recipes) => [...ustensils, ...recipes.ustensils],
        [],
      ),
  },
];

function setupFilters(recipes: Recipe[]): void {
  const filters = initializeFilters();
  const container = new FilterContainer(
    document.querySelector<HTMLElement>('#applied-filters')!,
  );
  filters.forEach((filter) => {
    container.add(filter);
    ComponentRenderer.reattachComponentToDom(
      document.querySelector<HTMLElement>('#filters')!,
      filter,
    );
  });

  container.subscribe((e) => console.log(e.current));
}

main().catch(console.error);

export {};
