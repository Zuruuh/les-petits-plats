import { RecipesProvider } from '../providers/RecipesProvider';
import { Filter } from '../../base/components/Filter/Filter';
import { ComponentRenderer } from '../../base/renderer/ComponentRenderer';
import { FilterContainer } from '../../base/components/Filter/FilterContainer';

async function main(): Promise<void> {
  const recipes = await RecipesProvider.all();

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

  console.log(recipes);
}

function initializeFilters(): Filter[] {
  return [
    new Filter(
      'Ingrédients',
      '#3282f7',
      'Rechercher un ingrédient',
      Array.from<string>({ length: 30 }).fill('Pates'),
    ),
    new Filter(
      'Appareils',
      '#68d9a4',
      'Rechercher un appareil',
      Array.from<string>({ length: 30 }).fill('Four'),
    ),
    new Filter(
      'Ustensiles',
      '#ed6454',
      'Rechercher un ustensile',
      Array.from<string>({ length: 30 }).fill('Couteau'),
    ),
  ];
}

main().catch(console.error);

export {};
