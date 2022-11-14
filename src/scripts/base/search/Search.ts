import { Observable } from '../utils/Observable';
import { Filter } from '../components/Filter/Filter';
import { FilterContainer } from '../components/Filter/FilterContainer';
import type { FilterDataWithOptionProvider } from '../components/Filter/types/FilterData';
import type { FilterOptionGeneratorHook } from '../components/Filter/types/FilterOptionGeneratorHook';
import type { SearchContentAggregator } from './types/SearchContentAggregator';
import type { IdentifiableObject } from '../types/Identifiable';
import { StringNormalizer } from '../string/StringNormalizer';

export class Search<T extends IdentifiableObject> extends Observable<T[]> {
  private lastQuery: string = '';
  private readonly filtersMap: Record<string, Filter> = {};
  private filterContainer: FilterContainer;
  private filterHooks: Record<string, FilterOptionGeneratorHook<T>[]> = {};
  private filterHooksLabelMap: Record<string, Filter> = {};
  private aggregatedSearchContent: Record<PropertyKey, string[]> = {};

  public constructor(
    private readonly searchables: T[],
    filtersData: FilterDataWithOptionProvider<T>[],
    emptyFilterContainer: FilterContainer,
    private searchContentAggregator: SearchContentAggregator<T>,
  ) {
    super(searchables);

    this.aggregateSearchContent();
    this.filtersMap = this.instantiateFilters(
      filtersData,
      emptyFilterContainer,
    );
    this.filterContainer = emptyFilterContainer;
    this.listenToFiltersUpdates();
  }

  public search(query: string): T[] {
    this.lastQuery = query;
    const splitQuery = query.toLowerCase().split(' ');
    Object.values(this.filtersMap).forEach((filter) =>
      filter.updateOptions([]),
    );
    const map = {};

    const results = this.searchables.filter((searchable) => {
      const aggregatedSearchContent =
        this.aggregatedSearchContent[searchable.id];

      const match =
        Object.entries(this.filterContainer.current).every(
          ([filterLabel, values]) =>
            Object.keys(values).every((value) =>
              this.filtersMap[filterLabel]!.apply(searchable, value),
            ),
        ) &&
        aggregatedSearchContent.some((string) => {
          return splitQuery.every((queryPart) => string.includes(queryPart));
        });

      if (match) {
        this.triggerFilterHooks(searchable, map);
      }

      return match;
    });

    this.next(results);

    return results;
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

  private triggerFilterHooks(
    searchable: T,
    alreadyExistingFiltersMap: Record<string, Record<string, string>>,
  ): void {
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
      .reduce((prev, curr) => {
        const next = { ...prev };
        Object.keys(curr).forEach((key) => {
          if (Object.hasOwn(next, key) && Array.isArray(next[key])) {
            (next[key] as string[]).concat(curr[key]);
          } else {
            next[key] = curr[key];
          }
        });

        return next;
      }, {});

    Object.entries(optionsMap).forEach(([label, options]) => {
      const filter = this.filterHooksLabelMap[label];
      if (!(label in alreadyExistingFiltersMap)) {
        alreadyExistingFiltersMap[label] = {};
      }

      options.forEach((option) => {
        const optionKey = StringNormalizer.normalize(option);

        const currentAppliedFilters = this.filterContainer?.current[label];

        if (!(optionKey in alreadyExistingFiltersMap[label])) {
          if (!currentAppliedFilters || !currentAppliedFilters[optionKey]) {
            alreadyExistingFiltersMap[label][optionKey] = option;
            filter.addOption(option);
          }
        }
      });
    });
  }

  private instantiateFilters(
    filtersData: FilterDataWithOptionProvider<T>[],
    emptyFilterContainer: FilterContainer,
  ): Record<string, Filter> {
    const filters = filtersData.map((filterData) => {
      const filter = new Filter(
        filterData.label,
        filterData.color,
        filterData.inputPlaceholder,
        [],
        filterData.apply,
      );

      this.addFilterHook(filter, filterData.optionProvider);
      emptyFilterContainer.add(filter);

      return filter;
    });

    const map = {};
    for (const searchable of this.searchables) {
      this.triggerFilterHooks(searchable, map);
    }

    return filters.reduce(
      (acc, filter) => ({ ...acc, [filter.label]: filter }),
      {},
    );
  }

  private aggregateSearchContent(): void {
    this.searchables.forEach((searchable: T) => {
      this.aggregatedSearchContent[searchable.id] =
        this.searchContentAggregator(searchable).map((content) =>
          content.toLowerCase(),
        );
    });
  }

  private listenToFiltersUpdates(): void {
    this.filterContainer.subscribeForPageLifecycle(() =>
      this.search(this.lastQuery),
    );
  }

  public getLastQuery(): string {
    return this.lastQuery;
  }
}
