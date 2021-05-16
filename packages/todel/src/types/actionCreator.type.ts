import type { Guard, Meta } from "./common.type";

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
