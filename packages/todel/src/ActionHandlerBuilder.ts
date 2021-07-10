import {
  caseActionHandler,
  combineActionHandlers,
} from "./actionHandlerHelpers";
import { Action } from "./types/actionCreator.type";
import { ActionHandler } from "./types/actionHandler.type";
import { Guard } from "./types/common.type";

export class ActionHandlerBuilder<Atoms = unknown> {
  static create<A = unknown>(): ActionHandlerBuilder<A> {
    return new ActionHandlerBuilder();
  }

  private handlers: ActionHandler<Atoms>[] = [];

  addCase<A extends Action>(
    matcher: Guard<Action, A>,
    handler: ActionHandler<Atoms, A>
  ): this {
    this.handlers.push(caseActionHandler(matcher, handler));
    return this;
  }

  build(): ActionHandler<Atoms, Action> {
    return combineActionHandlers(...this.handlers);
  }
}
