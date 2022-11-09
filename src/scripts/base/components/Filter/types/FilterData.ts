import type { HexColor } from '../../../types/HexColor';
import { FilterOptionGeneratorHook } from './FilterOptionGeneratorHook';

export interface FilterData<T> {
  label: string;
  color: HexColor;
  inputPlaceholder: string;
  options: string[];
  apply: (object: T, option: string) => boolean;
}

export type FilterDataOptionless<T> = Omit<FilterData<T>, 'options'>;

export type FilterDataWithOptionProvider<T = any> = FilterDataOptionless<T> & {
  optionProvider: FilterOptionGeneratorHook<T>;
};
