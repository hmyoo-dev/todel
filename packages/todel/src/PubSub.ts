import type {
  MultiConsumer,
  Subscribable,
  Subscription,
} from "./types/common.type";

export class PubSub<
  V,
  Others extends unknown[] = [],
  Values extends unknown[] = [V, ...Others]
> implements Subscribable<Values> {
  private subscriberSet = new Set<MultiConsumer<Values>>();

  publish(value: V, ...others: Others): void {
    const values = [value, ...others] as Values;
    this.subscriberSet.forEach((subscriber) => subscriber(...values));
  }

  subscribe(subscriber: MultiConsumer<Values>): Subscription {
    this.subscriberSet.add(subscriber);
    return {
      unsubscribe: () => this.subscriberSet.delete(subscriber),
    };
  }
}
