import type { Action } from "./types/actionCreator.type";
import type {
  ActionHandler,
  ActionHandlerOption,
  CombinedActionHandler,
} from "./types/actionHandler.type";
import type { Guard, Meta } from "./types/common.type";

export function actionHandler<P, M extends Meta = Meta>(
  option: ActionHandlerOption<P, M>
): ActionHandler {
  const { matcher, handler } = option;

  const actionHandler: ActionHandler = (action, effector) => {
    if (matcher(action)) {
      return handler(action, effector);
    }
  };

  return actionHandler;
}

export function combineActionHandlers(
  handlers: readonly ActionHandler[]
): CombinedActionHandler {
  const combineActionHandler: CombinedActionHandler = (action, effector) => {
    const promiseResults = handlers
      .map((handler) => handler(action, effector))
      .filter((result) => result instanceof Promise);

    return Promise.all(promiseResults);
  };

  return combineActionHandler;
}

export function anyMatchActions<P, M extends Meta = Meta>(
  ...matchers: Guard<Action, Action<P, M>>[]
): Guard<Action, Action<P, M>> {
  return ((action) => matchers.some((matcher) => matcher(action))) as Guard<
    Action,
    Action<P, M>
  >;
}
