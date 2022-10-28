import { Observable } from '../utils/Observable';
import { Filter } from '../components/Filter/Filter';
import { FilterContainer } from '../components/Filter/FilterContainer';
import type { FilterDataWithOptionProvider } from '../components/Filter/types/FilterData';
import type { FilterOptionGeneratorHook } from '../components/Filter/types/FilterOptionGeneratorHook';
import type { SearchContentAggregator } from './types/SearchContentAggregator';
import type { IdentifiableObject } from '../types/Identifiable';

export class Search<T extends IdentifiableObject> extends Observable<T[]> {
  private lastQuery: string = '';
  private readonly filters: Filter[];
  private filterHooks: Record<string, FilterOptionGeneratorHook<T>[]> = {};
  private filterHooksLabelMap: Record<string, Filter> = {};
  private aggregatedSearchContent: Record<PropertyKey, string[]> = {};

  public constructor(
    private readonly searchables: T[],
    filtersData: FilterDataWithOptionProvider<T>[],
    private emptyFilterContainer: FilterContainer,
    private searchContentAggregator: SearchContentAggregator<T>,
  ) {
    super(searchables);

    this.aggregateSearchContent();
    this.filters = this.instantiateFilters(filtersData);
  }

  public search(query: string): T[] {
    this.lastQuery = query;
    const splitQuery = query.toLowerCase().split(' ');
    const searched = this.searchables.filter((searchable) => {
      this.triggerFilterHooks(searchable);
      const aggregatedSearchContent =
        this.aggregatedSearchContent[searchable.id];

      return aggregatedSearchContent.some((string) => {
        return splitQuery.every((queryPart) => string.includes(queryPart));
      });
    });

    this.next(searched);

    return searched;
  }

  private addFilterHook(
    filter: Filter,
    callback: FilterOptionGeneratorHook<T>,
  ): void {
    if (!(filter.label in this.filterHooks)) {
      this.filterHooks[filter.label] = [];
    }

    this.filterHooks[filter.label].push(callback);
    this.filterHooksLabelMap[filter.label] = filter;
  }

  private triggerFilterHooks(searchable: T): void {
    // TODO: Combine this .map.reduce to just .reduce
    // TODO: Refactor all of this in a single loop if feasible
    // TODO: Make sure entries are unique (Maybe use a map with all entries used a keys instead of using Array.from(new Set)) ?
    const optionsMap = Object.entries(this.filterHooks)
      .map(([label, hooks]) => {
        let options = hooks.map((hook) => {
          let option = hook(searchable);
          if (!Array.isArray(option)) {
            option = [option];
          }

          return option;
        });

        return {
          [label]: options.reduce((prev, option) => [...prev, ...option], []),
        };
      })
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});

    Object.entries(optionsMap).forEach(([label, options]) => {
      const filter = this.filterHooksLabelMap[label];
      filter.updateOptions(
        Array.from(new Set([...filter.getOptions(), ...options])),
      );
    });
  }

  private instantiateFilters(
    filtersData: FilterDataWithOptionProvider<T>[],
  ): Filter[] {
    const filters = filtersData.map((filterData) => {
      const filter = new Filter(
        filterData.label,
        filterData.color,
        filterData.inputPlaceholder,
        [],
      );

      this.addFilterHook(filter, filterData.optionProvider);
      this.emptyFilterContainer.add(filter);

      return filter;
    });

    for (const searchable of this.searchables) {
      this.triggerFilterHooks(searchable);
    }

    return filters;
  }

  private aggregateSearchContent(): void {
    this.searchables.forEach((searchable: T) => {
      this.aggregatedSearchContent[searchable.id] =
        this.searchContentAggregator(searchable).map((content) =>
          content.toLowerCase(),
        );
    });
  }
}
