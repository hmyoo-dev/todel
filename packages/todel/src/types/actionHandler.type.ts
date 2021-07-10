import type { Action } from "./actionCreator.type";
import type { Consumer } from "./common.type";

export interface ActionEffector {
  emitError: Consumer<Error>;
  dispatch: Consumer<Action>;
}

export interface ActionHandler<Atoms = unknown, A extends Action = Action> {
  (action: A, atoms: Atoms, effector: ActionEffector): void | Promise<unknown>;
}

export interface ActionErrorHandler<Atoms = unknown> {
  (error: unknown, atoms: Atoms, effector: ActionEffector): void;
}
