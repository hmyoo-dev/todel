import type { Store } from "../Store";
import type { ActionHandler } from "./actionHandler.type";
import type { Consumer } from "./common.type";

export interface StorePayload<S> {
  atoms: S;
  actionHandlers: ActionHandler[];
  errorHandler?: Consumer<unknown>;
}

export interface StorePayloadProvider<S> {
  (): StorePayload<S>;
}

export type AnyStore = Store<unknown>;
