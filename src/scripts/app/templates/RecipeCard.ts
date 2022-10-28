import type { Recipe } from '../models/Recipe';
import { HTMLNodeBuilder } from '../../base/composers/HTMLNodeBuilder';

export class RecipeCard {
  public constructor(public readonly recipe: Recipe) {}

  public render(): HTMLElement {
    return HTMLNodeBuilder.node({
      tag: 'article',
      attributes: {
        class: 'recipe-card col-xs-6 col-md-4 col-lg-3',
        tabindex: '0',
      },
      children: [
        {
          tag: 'div',
          attributes: {
            class: 'card my-4',
          },
          children: [
            {
              tag: 'div',
              attributes: { class: 'card-img-top' },
            },
            {
              tag: 'div',
              attributes: { class: 'card-body' },
              children: [
                {
                  tag: 'div',
                  attributes: {
                    class: 'card-title d-flex justify-content-between',
                  },
                  children: [
                    {
                      tag: 'h5',
                      attributes: { class: 'fw-normal' },
                      text: this.recipe.name,
                    },
                    {
                      tag: 'div',
                      attributes: {
                        class: 'fw-bold',
                      },
                      children: [
                        {
                          tag: 'i',
                          attributes: {
                            class: 'fa-regular fa-clock',
                          },
                        },
                        {
                          tag: 'span',
                          text: `${this.recipe.time} mins`,
                        },
                      ],
                    },
                  ],
                },
                {
                  tag: 'div',
                  attributes: {
                    class: 'card-text fw-normal d-flex justify-content-between',
                  },
                  children: [
                    {
                      tag: 'ul',
                      attributes: {
                        class:
                          'd-flex flex-column justify-content-start m-0 p-0 w-50',
                      },
                      children: this.recipe.ingredients.map<HTMLElement>(
                        (ingredient) =>
                          HTMLNodeBuilder.node({
                            tag: 'li',
                            children: [
                              {
                                tag: 'span',
                                attributes: { class: 'fw-bold' },
                                text: `${ingredient.ingredient}${
                                  ingredient.quantity ? ': ' : ''
                                }`,
                              },
                              {
                                tag: 'span',
                                text: `${ingredient.quantity ?? ''} ${
                                  ingredient.unit ?? ''
                                }`,
                              },
                            ],
                          }),
                      ),
                    },
                    {
                      tag: 'span',
                      attributes: {
                        class: 'text-break w-50',
                        style: `-webkit-line-clamp: ${this.recipe.ingredients.length};`,
                      },
                      text: this.recipe.description,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }
}
