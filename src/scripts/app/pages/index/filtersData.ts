import type { FilterDataWithOptionProvider } from '../../../base/components/Filter/types/FilterData';
import type { Recipe } from '../../models/Recipe';
import { StringNormalizer } from '../../../base/string/StringNormalizer';

export const FILTERS_DATA_WITH_PROVIDERS: FilterDataWithOptionProvider<Recipe>[] =
  [
    {
      label: 'Ingrédients',
      color: '#3282f7',
      inputPlaceholder: 'Rechercher un ingrédient',
      optionProvider: (recipe) =>
        recipe.ingredients.map(({ ingredient }) => ingredient),
      apply: (recipe, option) =>
        recipe.ingredients.some(
          ({ ingredient }) => StringNormalizer.normalize(ingredient) === option,
        ),
    },
    {
      label: 'Appareils',
      color: '#68d9a4',
      inputPlaceholder: 'Rechercher un appareil',
      optionProvider: (recipe) => recipe.appliance,
      apply: (recipe, option) =>
        StringNormalizer.normalize(recipe.appliance) === option,
    },
    {
      label: 'Ustensiles',
      color: '#ed6454',
      inputPlaceholder: 'Rechercher un ustensile',
      optionProvider: (recipe) => recipe.ustensils,
      apply: (recipe, option) =>
        recipe.ustensils.some(
          (ustensil) => StringNormalizer.normalize(ustensil) === option,
        ),
    },
  ];
