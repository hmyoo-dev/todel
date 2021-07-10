import { ActionHandlerBuilder } from "../src/ActionHandlerBuilder";
import { increase, reset } from "./fixtures/actions.fixtures";

test("run handlers by case", () => {
  const builder = new ActionHandlerBuilder();
  const handlers = {
    increase: jest.fn(),
    reset: jest.fn(),
    resetOther: jest.fn(),
  };

  const resultHandler = builder
    .addCase(increase.match, handlers.increase)
    .addCase(reset.match, handlers.reset)
    .addCase(reset.match, handlers.resetOther)
    .build();

  const action = reset();
  const atoms = {};
  const effector = {} as never;

  resultHandler(action, atoms, effector);

  expect(handlers.reset).toHaveBeenCalledWith(action, atoms, effector);
  expect(handlers.resetOther).toHaveBeenCalledWith(action, atoms, effector);
  expect(handlers.increase).not.toHaveBeenCalled();
});
