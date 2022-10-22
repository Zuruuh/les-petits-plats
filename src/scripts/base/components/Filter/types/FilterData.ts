import type { HexColor } from '../../../types/HexColor';
import { FilterOptionGeneratorHook } from './FilterOptionGeneratorHook';

export interface FilterData {
  label: string;
  color: HexColor;
  inputPlaceholder: string;
  options: string[];
}

export type FilterDataOptionless = Omit<FilterData, 'options'>;

export type FilterDataWithOptionProvider<T> = FilterDataOptionless & {
  optionProvider: FilterOptionGeneratorHook<T>;
};
