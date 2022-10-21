import { RandomStringGenerator } from '../../generators/RandomStringGenerator';
import { HTMLNodeBuilder } from '../../composers/HTMLNodeBuilder';
import { FilterContainer } from './FilterContainer';
import type { HexColor } from '../../types/HexColor';
import type { ComponentInterface } from '../../renderer/ComponentInterface';
import type { IdentifiableInterface } from '../../types/IdentifiableInterface';
import type { HTMLNode } from '../../composers/HTMLNodeBuilder';

export class Filter implements ComponentInterface, IdentifiableInterface {
  private readonly id: string;
  private container: FilterContainer | undefined;

  public constructor(
    private readonly label: string,
    private readonly color: HexColor,
    private readonly inputPlaceholder: string,
    private options: string[],
  ) {
    this.id = RandomStringGenerator.generate();
  }

  public render(): HTMLElement {
    return HTMLNodeBuilder.node({
      tag: 'div',
      attributes: {
        tabindex: 0,
        style: `--color: ${this.color}`,
      },
      eventListeners: {
        focus: (e: FocusEvent) => {
          const input = (
            e.currentTarget as HTMLElement
          ).querySelector<HTMLInputElement>(`#${this.getUniqueInputId()}`)!;

          if (e.relatedTarget !== input) {
            input.focus();
          }
        },
      },
      children: [
        {
          tag: 'div',
          attributes: { class: 'filter-controls' },
          children: [
            {
              tag: 'label',
              attributes: { for: this.getUniqueInputId() },
              text: this.label,
            },
            {
              tag: 'input',
              attributes: {
                id: this.getUniqueInputId(),
                placeholder: this.inputPlaceholder,
              },
              eventListeners: {
                change: this.onInput.bind(this),
              },
            },
            {
              tag: 'i',
              attributes: {
                class: 'fa-solid fa-chevron-down',
              },
            },
          ],
        },
        {
          tag: 'div',
          attributes: {
            class: 'filter-content',
          },
          children: this.options.map(
            (option): HTMLNode => ({
              tag: 'button',
              eventListeners: {
                click: () => this.onSelectOption.bind(this)(option),
              },
              text: option,
            }),
          ),
        },
      ],
    });
  }

  public updateOptions(options: string[]): void {
    this.options = options;
  }

  public setContainer(container: FilterContainer | undefined): void {
    this.container = container;
  }

  private onSelectOption(option: string): void {
    if (!this.container) {
      throw new Error('Illegal State');
    }

    this.container.selectOption(option, this.color);
  }

  private onInput(event: Event): void {
    console.log((event.currentTarget as HTMLInputElement).value);
  }

  public getId(): string {
    return this.id;
  }

  public getComponentClassName(): string {
    return 'filter-input';
  }

  private getUniqueInputId(): string {
    return `${this.getComponentClassName()}-field-${this.getId()}`;
  }
}
