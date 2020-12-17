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
    expect(doneAtom.data.value).toBe(null);
  });

  it("should set success when done", () => {
    const atom = AuthorAtom.pending();
    atom.requestDone(author);

    atomStatusEqual(atom, S.Success);
    expect(atom.data.value).toEqual(author);
  });

  it("should set failure when failed", () => {
    const atom = AuthorAtom.pending();
    const err = new Error("test error");

    atom.requestFailed(err);

    atomStatusEqual(atom, S.Failure);
    expect(atom.data.value).toEqual(null);
    expect(atom.data.error).toEqual(err);
  });

  it("has default value from initial value", () => {
    class TestAtom extends AjaxAtom<string> {}

    const atom = new TestAtom(idleAjaxAtomState("foo"));
    expect(atom.data.value).toEqual("foo");
    atom.requestDone("bar");
    expect(atom.data.value).toEqual("bar");
    atom.requestStarted();
    expect(atom.data.value).toEqual("foo");
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

    it("should update failure when request failed", async () => {
      const atom = AuthorAtom.idle();

      const request = atom.updateWith(getAuthorFailed());
      atomStatusEqual(atom, S.Pending);

      await request.catch(() => "");
      atomStatusEqual(atom, S.Failure);
      expect(atom.data.value).toBe(null);
      expect(atom.data.error).toBeInstanceOf(Error);
    });

    function getAuthorSuccess(): Promise<Author> {
      return Promise.resolve(author);
    }

    function getAuthorFailed(): Promise<Author> {
      return Promise.reject(new Error("test"));
    }
  });
});

function atomStatusEqual<T>(atom: AjaxAtom<T>, status: AjaxStatus): void {
  expect(atom.data.status).toEqual(status);
}
