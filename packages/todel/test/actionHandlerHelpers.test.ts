import { actionCreator } from "../src/actionCreators";
import { actionHandler, anyMatchActions } from "../src/actionHandlerHelpers";
import { ActionEffector } from "../src/types";

describe("createActionEventHandler", () => {
  const name = "foo";
  const email = "foo@bar.com";

  it("should call handler with type guard", (done) => {
    const handler = actionHandler({
      matcher: testName.match,
      handler: (action) => {
        expect(action.payload.name).toEqual(name);
        done();
      },
    });

    handler(testName({ name }), mockActionEffector());
  });

  it("could take multiple action creators", (done) => {
    const handler = actionHandler({
      matcher: anyMatchActions<{ name: string }>(
        testName.match,
        testUser.match
      ),
      handler: (action) => {
        action.payload;
        expect(action.payload.name).toEqual(name);
        done();
      },
    });

    handler(testUser({ name, email }), mockActionEffector());
  });

  it("shouldn't call handler when not matched action", () => {
    const handler = jest.fn();

    const resultHandler = actionHandler({
      matcher: testName.match,
      handler,
    });

    resultHandler(testEmail({ email }), mockActionEffector());

    expect(handler).not.toHaveBeenCalled();
  });
});

const testName = actionCreator<{ name: string }>("testName");
const testEmail = actionCreator<{ email: string }>("testEmail");
const testUser = actionCreator<{ name: string; email: string }>("testUser");

function mockActionEffector(): ActionEffector {
  return {
    dispatch: jest.fn(),
    emitError: jest.fn(),
  };
}
