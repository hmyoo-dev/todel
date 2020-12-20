import { CounterAtom, OnlyStateAtom } from "./fixtures/Atom.fixtures";

describe("Atom", () => {
  it("should be created with initial value", () => {
    const counterAtom = new CounterAtom({ count: 10 });

    expect(counterAtom.data.count).toEqual(10);
  });

  describe("data", () => {
    it("should be ok when computed not declared", () => {
      const atom = new OnlyStateAtom({ count: 2 });
      expect(atom.data.count).toBe(2);
    });

    it("should be same object when not changed", () => {
      const counterAtom = CounterAtom.fromCount(10);
      expect(counterAtom.data).toBe(counterAtom.data);
    });

    it("will change with updateState method", () => {
      const counterAtom = CounterAtom.fromCount(0);
      counterAtom.increase();
      expect(counterAtom.data.count).toEqual(1);
    });

    it("should have methods that return computed value", () => {
      const counterAtom = CounterAtom.fromCount(1);
      expect(counterAtom.data.getRest(10)).toEqual(9);
    });
  });

  describe("subscribe()", () => {
    it("should call callback when updated", (done) => {
      const counterAtom = CounterAtom.fromCount(1);

      counterAtom.subscribe((atom) => {
        expect(atom.state.count).toEqual(2);
        done();
      });

      counterAtom.increase();
    });
  });

  describe("toJson()", () => {
    it("should return state object", () => {
      const counterAtom = CounterAtom.fromCount(1);
      expect(counterAtom.toJson()).toEqual({ count: 1 });
    });
  });
});
