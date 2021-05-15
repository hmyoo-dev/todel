import { createCounterAtom } from "./fixtures/atoms.fixtures";

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
    });

    it("should be reactive", () => {
      const counter = createCounterAtom({ initState: 0 });
      const subscriber = jest.fn();

      counter.subscribe(subscriber);
      counter.modifiers.increase();

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(counter);
    });

    it("should have computed value", () => {
      const counter = createCounterAtom({ initState: 1 });
      expect(counter.computed.getDoubled()).toBe(2);
    });

    it("should return state when toJson() called", () => {
      const counter = createCounterAtom({ initState: 1 });
      expect(counter.toJson()).toBe(1);
    });
  });
});
