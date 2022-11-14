export class StringNormalizer {
  private static normalizedStringsMap: Record<string, string> = {};

  public static normalize(string: string): string {
    if (this.normalizedStringsMap[string]) {
      return this.normalizedStringsMap[string];
    }

    const normalized = string
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\W/g, '');

    this.normalizedStringsMap[string] = normalized;
    return normalized;
  }
}
