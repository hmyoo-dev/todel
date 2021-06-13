import {
  AjaxStatus,
  createAjaxAtom,
  createCounterAtom,
} from "./fixtures/atoms.fixtures";

describe("atomCreator", () => {
  describe("atom", () => {
    it("could be created without init state", () => {
      const counter = createCounterAtom();
      expect(counter.state).toBe(0);
    });

    it("could be created with init state", () => {
      const counter = createCounterAtom({ initState: 10 });
      expect(counter.state).toBe(10);
    });

    it("could be created with deps", () => {
      const counter = createCounterAtom({ initState: 0, deps: { step: 10 } });
      counter.modifiers.increase();
      expect(counter.state).toBe(10);
    });

    it("should be update with modifier", () => {
      const counter = createCounterAtom({ initState: 0 });
      counter.modifiers.increase();
      expect(counter.state).toBe(1);

      counter.modifiers.decrease();
      expect(counter.state).toBe(0);
    });

    describe("asyncModifier", () => {
      test("success", async () => {
        const atom = createAjaxAtom();

        const pending = atom.modifiers.fetch(Promise.resolve("test"));
        expect(atom.state.status).toEqual(AjaxStatus.Pending);

        await pending;
        const { status, data } = atom.state;
        expect(status).toEqual(AjaxStatus.Done);
        expect(data).toEqual("test");
      });

      test("failed", (done) => {
        const atom = createAjaxAtom();
        atom.modifiers.fetch(Promise.reject("err")).catch((err) => {
          expect(atom.state.status).toEqual(AjaxStatus.Failed);
          expect(err).toEqual("err");
          done();
        });
      });

      test("memo", async () => {
        const atom = createAjaxAtom();
        const subscriber = jest.fn();
        atom.subscribe(subscriber);

        await atom.modifiers.fetch(Promise.resolve("hello"), "foo");

        const [started, done] = subscriber.mock.calls;
        expect(started).toEqual([atom, "foo/started"]);
        expect(done).toEqual([atom, "foo/done"]);
      });

      test("nothing-success", async () => {
        const atom = createAjaxAtom();
        await atom.modifiers.nothing(Promise.resolve("nothing"));
        expect(atom.state.status).toEqual(AjaxStatus.Idle);
      });

      test("nothing-failed", (done) => {
        const atom = createAjaxAtom();
        atom.modifiers.nothing(Promise.reject("nothing")).catch((err) => {
          expect(atom.state.status).toEqual(AjaxStatus.Idle);
          expect(err).toEqual("nothing");
          done();
        });
      });
    });

    it("should be reactive", () => {
      const counter = createCounterAtom({ initState: 0 });
      const subscriber = jest.fn();

      counter.subscribe(subscriber);
      counter.modifiers.increase();

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(counter, null);
    });

    it("should have computed value", () => {
      const counter = createCounterAtom({ initState: 1 });
      expect(counter.computed.getDoubled()).toBe(2);
    });

    it("should return state when toJson() called", () => {
      const counter = createCounterAtom({ initState: 1 });
      const { toJson } = counter;
      expect(toJson()).toBe(1);
    });
  });
});
