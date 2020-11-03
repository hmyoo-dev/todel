import type { Service } from "./Service";

/** Common types */
export type Meta = Record<string, unknown>;

export interface ToJsonOption extends Meta {
  profile?: string;
}

export interface JsonSerializable {
  toJson(option?: ToJsonOption): unknown;
}

/** PubSub */
export interface Subscriber<Value> {
  (value: Value): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<Value> {
  subscribe(subscriber: Subscriber<Value>): Subscription;
}

/** Service types */
export interface StateModifier<State> {
  (current: State): State;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyService = Service<any>;
export type ServiceRepo = Record<string, AnyService>;
