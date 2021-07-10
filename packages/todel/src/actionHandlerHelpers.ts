import type { Action } from "./types/actionCreator.type";
import type { ActionHandler } from "./types/actionHandler.type";
import type { Guard } from "./types/common.type";

export function caseActionHandler<Atoms = unknown, A extends Action = Action>(
  matcher: Guard<Action, A>,
  handler: ActionHandler<Atoms, A>
): ActionHandler<Atoms> {
  return (action, atoms, effector) => {
    if (matcher(action)) {
      return handler(action, atoms, effector);
    }
  };
}

export function combineActionHandlers<Atoms = unknown>(
  ...handlers: ActionHandler<Atoms>[]
): ActionHandler<Atoms> {
  return (action, atoms, effector) => {
    const results = handlers
      .map((handler) => handler(action, atoms, effector))
      .filter((result) => result instanceof Promise);

    if (results.length > 0) {
      return Promise.all(results);
    }
  };
}
