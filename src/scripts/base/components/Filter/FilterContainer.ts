import { Observable } from '../../utils/Observable';
import { Filter } from './Filter';
import { HTMLNodeBuilder } from '../../composers/HTMLNodeBuilder';
import type { HexColor } from '../../types/HexColor';

export class FilterContainer extends Observable<string[]> {
  private filters: Filter[] = [];

  public constructor(private readonly selectedFiltersContainer: HTMLElement) {
    super([]);
  }

  public add(...filters: Filter[]): void {
    filters.forEach((filter) => {
      if (!this.filters.includes(filter)) {
        this.filters.push(filter);
        filter.setContainer(this);
      }
    });
  }

  public selectOption(option: string, color: HexColor): void {
    const element = this.renderButton(option, color);

    this.selectedFiltersContainer.appendChild(element);
    this.next([...this.current, option]);
  }

  private renderButton(option: string, color: HexColor): HTMLElement {
    return HTMLNodeBuilder.node({
      tag: 'div',
      attributes: {
        class: 'applied-filter p-2 pe-1 my-1 rounded d-flex align-items-center',
        style: `--color: ${color}`,
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
            click: (e: MouseEvent) => this.onRemoveSelect.bind(this)(e, option),
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

  private onRemoveSelect(e: MouseEvent, option: string): void {
    const button = e.currentTarget as HTMLButtonElement;
    button.parentElement!.remove();

    this.next(this.current.filter((filter) => filter !== option));
  }
}
