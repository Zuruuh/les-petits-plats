import type { ComponentInterface } from './ComponentInterface';
import type { IdentifiableInterface } from '../types/Identifiable';

export class ComponentRenderer {
  public static reattachComponentToDom(
    parent: HTMLElement,
    component: ComponentInterface,
  ): HTMLElement {
    const htmlComponent = component.render();
    let classes: string[] = [component.getComponentClassName()];

    if (ComponentRenderer.isIdentifiable(component)) {
      classes.push(`${classes[0]}-${component.getId()}`);
    }

    htmlComponent.classList.add(...classes);

    const existingComponent = parent.querySelector(
      classes.reduce((selector, className) => `${selector}.${className}`, ''),
    );

    if (existingComponent) {
      existingComponent.replaceWith(htmlComponent);
    } else {
      parent.appendChild(htmlComponent);
    }

    return htmlComponent;
  }

  private static isIdentifiable(
    component: object,
  ): component is IdentifiableInterface {
    return 'getId' in component;
  }
}
