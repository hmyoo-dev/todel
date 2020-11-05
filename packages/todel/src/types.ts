import type { Controller } from "./Controller";
import type { Service } from "./Service";
import type { Store } from "./Store";

/** Common types */
export interface Func<T, R> {
  (param: T): R;
}

export interface Consumer<T> {
  (param: T): void;
}

export interface Guard<T, R extends T> {
  (input: T): input is R;
}

export type ErrorEmitter = Consumer<Error>;

export type Meta = Record<string, unknown>;

export interface ToJsonOption extends Meta {
  profile?: string;
}

export interface JsonSerializable {
  toJson(option?: ToJsonOption): unknown;
}

/** PubSub */
export interface Subscription {
  unsubscribe(): void;
}

export interface Subscribable<Value> {
  subscribe(subscriber: Consumer<Value>): Subscription;
}

/** Action */
export interface Action {
  type: string;
}

export interface PayloadAction<Payload, M = Meta> extends Action {
  payload: Payload;
  meta: M;
}

export interface ActionCreator<Payload = void, M extends Meta = Meta> {
  type: string;
  (payload: Payload): PayloadAction<Payload, M>;
  match: Guard<Action, PayloadAction<Payload, M>>;
}

export interface PrepareActionCreator<
  Param = void,
  Payload = void,
  M extends Meta = Meta
> extends ActionCreator<Payload, M> {
  (param: Param): PayloadAction<Payload, M>;
}

/** Service types */
export interface StateModifier<State> {
  (current: State): State;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyService = Service<any>;
export type ServiceRepo = Record<string, AnyService>;

/** Store types */
export interface StorePayload<S extends ServiceRepo> {
  services: S;
  controllers: Controller[];
  errorHandler?: Consumer<unknown>;
}

export interface StorePayloadProvider<S extends ServiceRepo> {
  (): StorePayload<S>;
}

export type AnyStore = Store<ServiceRepo>;
