import { greeting } from "../src/index";

describe("greeting", () => {
  it("should return hello", () => {
    expect(greeting("world").toLowerCase()).toContain("hello");
  });
});
