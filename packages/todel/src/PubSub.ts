import type { Consumer, Subscribable, Subscription } from "./types";

export class PubSub<Value> implements Subscribable<Value> {
  private subscriberSet = new Set<Consumer<Value>>();

  publish(value: Value): void {
    this.subscriberSet.forEach((subscriber) => subscriber(value));
  }

  subscribe(subscriber: Consumer<Value>): Subscription {
    this.subscriberSet.add(subscriber);
    return {
      unsubscribe: () => this.subscriberSet.delete(subscriber),
    };
  }
}
