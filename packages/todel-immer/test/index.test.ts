import { Atom } from "todel";
import { withDraft } from "../src";

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

  it("should work with Atom", () => {
    const initState = createState();
    const service = new UserAtom(initState);

    service.setUser({ name: "test" });

    expect(initState.user).toBe(null);
    expect(service.data.user?.name).toEqual("test");
  });
});

interface User {
  name: string;
}

interface State {
  user: User | null;
  flag: boolean;
}

class UserAtom extends Atom<State> {
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
