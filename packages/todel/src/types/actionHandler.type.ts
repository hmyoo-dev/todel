import type { Action } from "./actionCreator.type";
import type { Consumer, Guard, Meta } from "./common.type";

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
