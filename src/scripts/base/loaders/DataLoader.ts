export class DataLoader {
  public async load<T = any>(uri: string): Promise<T> {
    return (await fetch(uri)).json();
  }
}
