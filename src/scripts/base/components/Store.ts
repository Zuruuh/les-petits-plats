export class Store {
  private static cache: Record<string, any> = {};

  public static get<T>(key: string): T {
    return Store.cache[key] as T;
  }

  public static has(key: string): boolean {
    return Boolean(Store.cache[key]);
  }

  public static set(key: string, value: any): void {
    Store.cache[key] = value;
  }
}
