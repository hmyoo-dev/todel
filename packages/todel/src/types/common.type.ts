export interface Func<T, R> {
  (param: T): R;
}

export interface Consumer<T> {
  (param: T): void;
}

export interface MultiConsumer<T extends unknown[]> {
  (...params: T): void;
}

export interface Guard<T, R extends T> {
  (input: T): input is R;
}

export type ExtendedKeys<T, E> = {
  [K in keyof T]: T[K] extends E ? K : never;
}[keyof T];

export type PickOnlyExtended<T, E> = Pick<T, ExtendedKeys<T, E>>;

export type Meta = Record<string, unknown>;

export interface ToJsonOption {
  profile?: string;
}

export interface JsonSerializable {
  toJson(option?: ToJsonOption): unknown;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<Values extends unknown[]> {
  subscribe(subscriber: MultiConsumer<Values>): Subscription;
}

export interface SelfSubscribable<Extra extends unknown[]> {
  subscribe(subscriber: MultiConsumer<[this, ...Extra]>): Subscription;
}
