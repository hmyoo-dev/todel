import type {
  Action,
  ActionCreator,
  PrepareActionCreator,
} from "./types/actionCreator.type";
import type { Func, Guard, Meta } from "./types/common.type";

export function actionCreator<P = void>(type: string): ActionCreator<P, Meta>;
export function actionCreator<M extends Meta, P = void>(
  type: string,
  meta: M
): ActionCreator<P, M>;
export function actionCreator(
  type: string,
  meta: Meta = {}
): ActionCreator<unknown, Meta> {
  function creator(payload: unknown): Action<unknown, Meta> {
    return {
      type,
      payload,
      meta,
    };
  }
  return applyActionCreator(type, creator);
}

export function prepareActionCreator<P, T = void>(
  type: string,
  prepare: Func<T, P>
): PrepareActionCreator<T, P, Meta>;
export function prepareActionCreator<M extends Meta, P = unknown, T = void>(
  type: string,
  prepare: Func<T, P>,
  meta: M
): PrepareActionCreator<T, P, M>;
export function prepareActionCreator(
  type: string,
  prepare: Func<unknown, unknown>,
  meta: Meta = {}
): PrepareActionCreator<unknown, unknown, Meta> {
  function creator(param: unknown): Action<unknown, Meta> {
    return {
      type,
      payload: prepare(param),
      meta,
    };
  }

  return applyActionCreator(type, creator);
}

export const scopedActionTypeFactory = (scopeName: string) => (
  type: string
): string => `${scopeName}/${type}`;

function applyActionCreator<T extends ActionCreator<unknown, Meta>>(
  type: string,
  creator: Func<unknown, unknown>
): T {
  type Matcher = Guard<Action, Action<unknown, Meta>>;

  const result = creator as T;
  result.type = type;
  result.match = ((action) => action.type === type) as Matcher;
  return result;
}
