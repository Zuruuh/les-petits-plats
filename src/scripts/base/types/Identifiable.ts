export type IdentifiableObject = { id: string };

export interface IdentifiableInterface {
  getId(): string;
}

export type Identifiable = IdentifiableInterface | IdentifiableObject;
