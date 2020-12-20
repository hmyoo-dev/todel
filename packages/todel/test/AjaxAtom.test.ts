import { AjaxAtom, AjaxStatus, idleAjaxAtomState } from "../src/AjaxAtom";
import { Author, AuthorAtom } from "./fixtures/AjaxAtom.fixtures";

const S = AjaxStatus;
describe("AjaxAtom", () => {
  const author: Author = { name: "Foo" };

  it("should set pending when started", () => {
    const idleAtom = AuthorAtom.idle();
    const doneAtom = AuthorAtom.done(author);

    idleAtom.requestStarted();
    doneAtom.requestStarted();

    atomStatusEqual(idleAtom, S.Pending);
    atomStatusEqual(doneAtom, S.Pending);
    expect(doneAtom.state.value).toBe(null);
  });

  it("should set success when done", () => {
    const atom = AuthorAtom.pending();
    atom.requestDone(author);

    atomStatusEqual(atom, S.Success);
    expect(atom.state.value).toEqual(author);
  });

  it("should set failure when failed", () => {
    const atom = AuthorAtom.pending();
    const err = new Error("test error");

    atom.requestFailed(err);

    atomStatusEqual(atom, S.Failure);
    expect(atom.state.value).toEqual(null);
    expect(atom.state.error).toEqual(err);
  });

  it("has default value from initial value", () => {
    class TestAtom extends AjaxAtom<string> {}

    const atom = new TestAtom(idleAjaxAtomState("foo"));
    expect(atom.state.value).toEqual("foo");
    atom.requestDone("bar");
    expect(atom.state.value).toEqual("bar");
    atom.requestStarted();
    expect(atom.state.value).toEqual("foo");
  });

  describe("updateWith()", () => {
    it("should update success when request succeed", async () => {
      const atom = AuthorAtom.idle();

      const request = atom.updateWith(getAuthorSuccess());
      atomStatusEqual(atom, S.Pending);

      const result = await request;
      atomStatusEqual(atom, S.Success);
      expect(result).toEqual(author);
    });

    it("can change result but return value equals result", async () => {
      const atom = AuthorAtom.idle();
      const result = await atom.updateWith(Promise.resolve(10), () => author);

      expect(result).toEqual(10);
      expect(atom.state.value).toEqual(author);
    });

    it("should update failure when request failed", async () => {
      const atom = AuthorAtom.idle();

      const request = atom.updateWith(getAuthorFailed());
      atomStatusEqual(atom, S.Pending);

      await request.catch(() => "");
      atomStatusEqual(atom, S.Failure);
      expect(atom.state.value).toBe(null);
      expect(atom.state.error).toBeInstanceOf(Error);
    });

    function getAuthorSuccess(): Promise<Author> {
      return Promise.resolve(author);
    }

    function getAuthorFailed(): Promise<Author> {
      return Promise.reject(new Error("test"));
    }
  });

  describe("Status flags", () => {
    const idle = AuthorAtom.idle();
    const pending = AuthorAtom.pending();
    const done = AuthorAtom.done(author);
    const failed = AuthorAtom.failed();

    test("isPending", () => {
      expect(idle.isPending()).toBe(false);
      expect(pending.isPending()).toBe(true);
    });

    test("isDone", () => {
      expect(pending.isDone()).toBe(false);
      expect(done.isDone()).toBe(true);
    });

    test("isFailed", () => {
      expect(done.isFailed()).toBe(false);
      expect(failed.isFailed()).toBe(true);
    });
  });
});

function atomStatusEqual<A extends AjaxAtom<unknown>>(
  atom: A,
  status: AjaxStatus
): void {
  expect(atom.state.status).toEqual(status);
}
