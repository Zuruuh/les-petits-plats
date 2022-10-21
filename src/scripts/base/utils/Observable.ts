import { RandomStringGenerator } from '../generators/RandomStringGenerator';

type ObservableSubscriber<T> = (next: Observable<T>) => Promise<any> | any;

export class Observable<T> {
  private subscribers: Record<string, ObservableSubscriber<T>> = {};

  public constructor(private value: T) {}

  public next(value: T): Promise<any>[] {
    this.value = value;

    return Object.values(this.subscribers).map((subscriber) =>
      subscriber(this),
    );
  }

  public subscribe(subscriber: ObservableSubscriber<T>): string {
    const key = this.generateSubscriberKey();
    this.subscribers[key] = subscriber;

    return key;
  }

  public subscribeForPageLifecycle(subscriber: ObservableSubscriber<T>): void {
    const key = this.subscribe(subscriber);

    window.addEventListener('beforeunload', () =>
      this.unsubscribe.bind(this)(key),
    );
  }

  public unsubscribe(key: string): boolean {
    const exists = key in this.subscribers;

    if (exists) {
      delete this.subscribers[key];
    }

    return exists;
  }

  public get current(): T {
    return this.value;
  }

  private generateSubscriberKey(): string {
    const key = RandomStringGenerator.generate();

    if (key in this.subscribers) {
      return this.generateSubscriberKey();
    }

    return key;
  }
}
