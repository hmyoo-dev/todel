import {
  caseActionHandler,
  combineActionHandlers,
} from "../src/actionHandlerHelpers";
import { decrease, increase } from "./fixtures/actions.fixtures";

const atoms = {};
const effector = {} as never;
const actions = {
  increase: increase(),
  decrease: decrease(),
};

test("caseActionHandler", () => {
  const handler = jest.fn();

  const result = caseActionHandler(increase.match, handler);

  result(actions.decrease, atoms, effector);
  expect(handler).not.toHaveBeenCalled();

  result(actions.increase, atoms, effector);
  expect(handler).toHaveBeenCalledWith(actions.increase, atoms, effector);
});

describe("combineActionHandlers", () => {
  it("should call handlers with a action", () => {
    const handlers = [jest.fn(), jest.fn()];
    const handler = combineActionHandlers(...handlers);
    const result = handler(actions.increase, atoms, effector);

    for (const mock of handlers) {
      expect(mock).toHaveBeenCalledWith(actions.increase, atoms, effector);
    }

    expect(result).toBeFalsy();
  });

  it("should return a promise if any handler returns a promise", () => {
    const handlers = [jest.fn(), jest.fn().mockReturnValue(Promise.resolve())];
    const handler = combineActionHandlers(...handlers);
    const result = handler(actions.increase, atoms, effector);

    expect(result).toBeInstanceOf(Promise);
  });
});
