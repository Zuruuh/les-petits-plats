import { RandomStringGenerator } from '../../generators/RandomStringGenerator';
import { HTMLNodeBuilder } from '../../composers/HTMLNodeBuilder';
import { FilterContainer } from './FilterContainer';
import type { HexColor } from '../../types/HexColor';
import type { ComponentInterface } from '../../renderer/ComponentInterface';
import type { IdentifiableInterface } from '../../types/Identifiable';

export class Filter<T = any>
  implements ComponentInterface, IdentifiableInterface
{
  private readonly id: string;
  private container: FilterContainer | undefined;
  private unfilteredOptions: string[];
  private lastQuery: string = '';

  public constructor(
    public readonly label: string,
    public readonly color: HexColor,
    private readonly inputPlaceholder: string,
    private options: string[],
    public readonly apply: (object: T, option: string) => boolean,
  ) {
    this.id = RandomStringGenerator.generate();
    this.unfilteredOptions = options;
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
                input: this.onInput.bind(this),
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
            class: `filter-content ${
              this.options.length > 30 ? 'large' : 'small'
            }`,
          },
          children: this.generateOptionsButtons.bind(this)(this.options),
        },
      ],
    });
  }

  public updateOptions(options: string[]): void {
    this.options = options;
    this.unfilteredOptions = options;

    if (this.container) {
      this.container.renderer(this);
    }
  }

  public addOption(option: string): void {
    this.options.push(option);
    this.updateOptions(this.options);
  }

  public setContainer(container: FilterContainer | undefined): void {
    this.container = container;
  }

  private onSelectOption(event: MouseEvent, option: string): void {
    if (!this.container) {
      throw new Error('Illegal State');
    }

    (event.currentTarget as HTMLElement)!.remove();
    this.container.selectOption(option, this);
  }

  private onInput(event: Event): void {
    const query = (event.currentTarget as HTMLInputElement).value;
    const optionsContainer =
      (event.currentTarget as HTMLElement)!.parentElement!.parentElement!.querySelector<HTMLElement>(
        '.filter-content',
      )!;
    optionsContainer.innerHTML = '';

    if (!query) {
      this.options = this.unfilteredOptions;
      const optionsButtons = this.generateOptionsButtons(this.options);

      for (const optionButton of optionsButtons) {
        optionsContainer.appendChild(optionButton);
      }
      this.lastQuery = query;

      return;
    }

    if (this.lastQuery.length > query.length) {
      this.options = this.unfilteredOptions;
    }

    const nextOptions = [];
    for (const option of this.options) {
      if (option.toLowerCase().includes(query.toLowerCase())) {
        nextOptions.push(option);
        optionsContainer.appendChild(this.generateOptionsButtons([option])[0]);
      }
    }

    this.lastQuery = query;
    this.options = nextOptions;
  }

  private generateOptionsButtons(options: string[]): HTMLElement[] {
    return options.map(
      (option): HTMLElement =>
        HTMLNodeBuilder.node({
          tag: 'button',
          eventListeners: {
            click: (e: MouseEvent) => this.onSelectOption.bind(this)(e, option),
          },
          text: option,
        }),
    );
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

  public getOptions(): string[] {
    return this.options;
  }
}
