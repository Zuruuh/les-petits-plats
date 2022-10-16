export class DataLoader {
  public async load(uri: string): Promise<void> {
    return (await fetch(uri)).json();
  }
}
