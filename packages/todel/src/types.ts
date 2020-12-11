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
export interface Action<Payload = unknown, M extends Meta = Meta> {
  type: string;
  payload: Payload;
  meta: M;
}

export interface ActionCreator<Payload = void, M extends Meta = Meta> {
  type: string;
  (payload: Payload): Action<Payload, M>;
  match: Guard<Action, Action<Payload, M>>;
}

export interface PrepareActionCreator<
  Param = void,
  Payload = void,
  M extends Meta = Meta
> extends ActionCreator<Payload, M> {
  (param: Param): Action<Payload, M>;
}

/** Atom types */
export interface StateModifier<State> {
  (current: State): State;
}

/** Controller types */
export interface ActionEffector {
  emitError: Consumer<Error>;
  dispatch: Consumer<Action>;
}

export interface ActionHandlerOption<P, M extends Meta = Meta> {
  matcher: Guard<Action, Action<P, M>>;
  handler: ActionHandler<P, M>;
}
export interface ActionHandler<P = unknown, M extends Meta = Meta> {
  (action: Action<P, M>, effector: ActionEffector): void | Promise<unknown>;
}

export interface CombinedActionHandler {
  (action: Action<unknown, Meta>, effector: ActionEffector): Promise<unknown>;
}

export interface Controller {
  getHandler(): ActionHandler;
}

/** Store types */
export interface StorePayload<S> {
  atoms: S;
  controllers: Controller[];
  errorHandler?: Consumer<unknown>;
}

export interface StorePayloadProvider<S> {
  (): StorePayload<S>;
}

export type AnyStore = Store<unknown>;
