import { Observable } from '../utils/Observable';
import { Filter } from '../components/Filter/Filter';
import { FilterContainer } from '../components/Filter/FilterContainer';
import type { FilterDataWithOptionProvider } from '../components/Filter/types/FilterData';
import type { FilterOptionGeneratorHook } from '../components/Filter/types/FilterOptionGeneratorHook';

export class Search<T> extends Observable<T[]> {
  private filters: Filter[];
  private filterHooks: Record<string, FilterOptionGeneratorHook<T>[]> = {};
  private filterHooksLabelMap: Record<string, Filter> = {};

  public constructor(
    private readonly searchables: T[],
    filtersData: FilterDataWithOptionProvider<T>[],
    private emptyFilterContainer: FilterContainer,
  ) {
    super(searchables);

    this.filters = this.instantiateFilters(filtersData);
  }

  public search(query: string): T[] {
    const searched = this.searchables.filter((searchable) => {
      this.triggerFilterHooks(searchable);
    });

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
      console.log(options);
      const filter = this.filterHooksLabelMap[label];
      filter.updateOptions(
        Array.from(new Set([...filter.getOptions(), ...options])),
      );
    });
  }

  private instantiateFilters(
    filtersData: FilterDataWithOptionProvider<T>[],
  ): Filter[] {
    return filtersData.map((filterData) => {
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
  }
}
