import { shallowEqual } from "../src/utils";

describe("shallowEqual", () => {
  const obj = { a: 1 };

  it("should compare shallow items in object", () => {
    const a = { obj, c: 10, d: "aa" };
    const b = { obj, c: 10, d: "aa" };

    expect(shallowEqual(a, b)).toBe(true);
  });

  it("should compare shallow items in array", () => {
    const a = [obj, 10, "aa"];
    const b = [obj, 10, "aa"];

    expect(shallowEqual(a, b)).toBe(true);
  });

  it("should return false when has different value", () => {
    const a = { obj, c: 1, d: "aa" };
    const b = { obj, c: 2, d: "aa" };

    expect(shallowEqual(a, b)).toBe(false);
  });

  it("should return false when has different reference", () => {
    const a = { obj, c: 10, d: "aa" };
    const b = { obj: { a: 1 }, c: 10, d: "aa" };

    expect(shallowEqual(a, b)).toBe(false);
  });

  it("should compare not object values", () => {
    expect(shallowEqual(null, null)).toBe(true);
    expect(shallowEqual(undefined, undefined)).toBe(true);
    expect(shallowEqual(null, undefined)).toBe(false);
  });
});
