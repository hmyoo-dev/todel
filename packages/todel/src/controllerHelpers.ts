import {
  Action,
  ActionEvent,
  ActionEventHandler,
  ActionEventHandlerOption,
  CombinedActionEventHandler,
  Guard,
  Meta,
} from "./types";

export function actionEventHandler<P, M extends Meta = Meta>(
  option: ActionEventHandlerOption<P, M>
): ActionEventHandler {
  const { matcher, handler } = option;

  return (actionEvent: ActionEvent): void | Promise<unknown> => {
    if (matcher(actionEvent.action)) {
      return handler(actionEvent as ActionEvent<P, M>);
    }
  };
}

export function combineActionEventHandlers(
  handlers: ActionEventHandler[]
): CombinedActionEventHandler {
  return (actionEvent: ActionEvent): Promise<unknown> => {
    const promiseResults = handlers
      .map((handler) => handler(actionEvent))
      .filter((result) => result instanceof Promise);

    return Promise.all(promiseResults);
  };
}

export function anyMatchActions<P, M extends Meta = Meta>(
  ...matchers: Guard<Action, Action<P, M>>[]
): Guard<Action, Action<P, M>> {
  return ((action) => matchers.some((matcher) => matcher(action))) as Guard<
    Action,
    Action<P, M>
  >;
}
