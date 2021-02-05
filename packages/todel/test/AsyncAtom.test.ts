import { AsyncAtom, AsyncStatus } from "../src/AsyncAtom";
import {
  Author,
  AuthorAtom,
  SimpleAsyncAtom,
} from "./fixtures/AsyncAtom.fixtures";

const S = AsyncStatus;
describe("AjaxAtom", () => {
  const author: Author = { name: "Foo" };

  describe("updateWith()", () => {
    it("should not change state when  no override method", async () => {
      const value = "TEST";
      const success = SimpleAsyncAtom.idle(value);
      const failure = SimpleAsyncAtom.idle(value);

      await success.updateWith(Promise.resolve());
      await failure.updateWith(Promise.reject()).catch(() => "");

      expect(success.state.value).toEqual(value);
      expect(failure.state.value).toEqual(value);
    });
    it("should set pending when started", () => {
      const idleAtom = AuthorAtom.idle();
      const doneAtom = AuthorAtom.done(author);

      idleAtom.updateWith(getAuthorSuccess());
      doneAtom.updateWith(getAuthorSuccess());

      atomStatusEqual(idleAtom, S.Pending);
      atomStatusEqual(doneAtom, S.Pending);
      expect(doneAtom.state.author).toBe(null);
    });

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
      expect(atom.state.author).toEqual(author);
    });

    it("should update failure when request failed", async () => {
      const atom = AuthorAtom.idle();

      const request = atom.updateWith(getAuthorFailed());
      atomStatusEqual(atom, S.Pending);

      await request.catch(() => "");
      atomStatusEqual(atom, S.Failure);
      expect(atom.state.author).toBe(null);
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

function atomStatusEqual<A extends AsyncAtom<any, any>>(
  atom: A,
  status: AsyncStatus
): void {
  expect(atom.state.status).toEqual(status);
}
