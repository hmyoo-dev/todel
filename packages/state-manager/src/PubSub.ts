import type { Subscribable, Subscriber, Subscription } from "./types";

export class PubSub<Value> implements Subscribable<Value> {
  private subscriberSet = new Set<Subscriber<Value>>();

  publish(value: Value): void {
    this.subscriberSet.forEach((subscriber) => subscriber(value));
  }

  subscribe(subscriber: Subscriber<Value>): Subscription {
    this.subscriberSet.add(subscriber);
    return {
      unsubscribe: () => this.subscriberSet.delete(subscriber),
    };
  }
}
