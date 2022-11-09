import type { Identifiable } from '../../types/Identifiable';

export type SearchContentAggregator<T extends Identifiable> = (
  searchable: T,
) => string[];
