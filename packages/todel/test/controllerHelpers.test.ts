import { actionCreator } from "../src";
import { actionEventHandler, anyMatchActions } from "../src/controllerHelpers";
import { Action, ActionEvent } from "../src/types";

describe("createActionEventHandler", () => {
  const name = "foo";
  const email = "foo@bar.com";

  it("should call handler with type guard", (done) => {
    const handler = actionEventHandler({
      matcher: testName.match,
      handler: ({ action }) => {
        expect(action.payload.name).toEqual(name);
        done();
      },
    });

    const event = mockActionEvent(testName({ name }));

    handler(event);
  });

  it("could take multiple action creators", (done) => {
    const handler = actionEventHandler({
      matcher: anyMatchActions<{ name: string }>(
        testName.match,
        testUser.match
      ),
      handler: ({ action }) => {
        action.payload;
        expect(action.payload.name).toEqual(name);
        done();
      },
    });

    const event = mockActionEvent(testUser({ name, email }));
    handler(event);
  });

  it("shouldn't call handler when not matched action", () => {
    const handler = jest.fn();

    const listener = actionEventHandler({
      matcher: testName.match,
      handler,
    });

    listener(mockActionEvent(testEmail({ email })));

    expect(handler).not.toHaveBeenCalled();
  });
});

const testName = actionCreator<{ name: string }>("testName");
const testEmail = actionCreator<{ email: string }>("testEmail");
const testUser = actionCreator<{ name: string; email: string }>("testUser");

function mockActionEvent(action: Action): ActionEvent {
  return {
    action,
    dispatch: jest.fn(),
    emitError: jest.fn(),
  };
}
