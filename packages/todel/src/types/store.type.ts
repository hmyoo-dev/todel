import type { Store } from "../Store";
import type { ActionErrorHandler, ActionHandler } from "./actionHandler.type";

export interface StorePayload<Atoms> {
  atoms: Atoms;
  actionHandler: ActionHandler<Atoms>;
  errorHandler?: ActionErrorHandler<Atoms>;
}

export type AnyStore = Store<unknown>;
