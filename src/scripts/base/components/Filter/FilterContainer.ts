import { Observable } from '../../utils/Observable';
import { Filter } from './Filter';
import { HTMLNodeBuilder } from '../../composers/HTMLNodeBuilder';

export class FilterContainer extends Observable<Record<string, string[]>> {
  private filters: Filter[] = [];

  /**
   * @param renderer The function called to render the filter in the dom
   */
  public constructor(
    private readonly selectedFiltersContainer: HTMLElement,
    public readonly renderer: (filter: Filter) => void,
  ) {
    super({});
  }

  public add(...filters: Filter[]): void {
    filters.forEach((filter) => {
      if (!this.filters.includes(filter)) {
        this.filters.push(filter);
        filter.setContainer(this);
        this.renderer(filter);
      }
    });
  }

  public selectOption(option: string, filter: Filter): void {
    const element = this.renderOption(option, filter);

    this.selectedFiltersContainer.appendChild(element);
    const options = this.current;
    if (!(filter.label in options)) {
      options[filter.label] = [];
    }

    options[filter.label].push(option);

    this.next(options);
  }

  private renderOption(option: string, filter: Filter): HTMLElement {
    return HTMLNodeBuilder.node({
      tag: 'div',
      attributes: {
        class: 'applied-filter p-2 pe-1 my-1 rounded d-flex align-items-center',
        style: `--color: ${filter.color}`,
        tabindex: 0,
      },
      children: [
        {
          tag: 'span',
          text: option,
        },
        {
          tag: 'button',
          attributes: {
            class:
              'text-white bg-transparent border-0 ms-1 d-flex align-content-center justify-content-center',
          },
          eventListeners: {
            click: (e: MouseEvent) =>
              this.onRemoveSelect.bind(this)(e, option, filter),
          },
          children: [
            {
              tag: 'i',
              attributes: { class: 'fa-regular fa-circle-xmark' },
            },
          ],
        },
      ],
    });
  }

  private onRemoveSelect(e: MouseEvent, option: string, filter: Filter): void {
    const button = e.currentTarget as HTMLButtonElement;
    button.parentElement!.remove();

    const nextData = this.current[filter.label].filter(
      (filter) => filter !== option,
    );

    this.next({ ...this.current, ...{ [filter.label]: nextData } });
  }

  public getFilters(): Filter[] {
    return this.filters;
  }
}
