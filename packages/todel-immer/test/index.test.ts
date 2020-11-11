import { withDraft } from "../src";
import { Service } from "todel";

describe(withDraft, () => {
  it("should return new state", () => {
    const before = createState();
    const result = withDraft<State>((state) => {
      state.flag = true;
    })(before);

    expect(before.flag).toBe(false);
    expect(result.flag).toBe(true);
  });

  it("should be recursive immutable", () => {
    const before = createState({ user: { name: "foo" } });
    const result = withDraft<State>((state) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.user!.name = "test";
    })(before);

    expect(before.user.name).toEqual("foo");
    expect(result.user.name).toEqual("test");
  });

  it("should work with Service.updateState", () => {
    const initState = createState();
    const service = new UserService(initState);

    service.setUser({ name: "test" });

    expect(initState.user).toBe(null);
    expect(service.state.user?.name).toEqual("test");
  });
});

interface User {
  name: string;
}

interface State {
  user: User | null;
  flag: boolean;
}

class UserService extends Service<State> {
  setUser(user: User): void {
    this.updateState(
      withDraft((state) => {
        state.user = user;
      })
    );
  }
}

function createState(state: Partial<State> = {}): State {
  return { user: null, flag: false, ...state };
}
