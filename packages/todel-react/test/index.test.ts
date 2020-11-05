import { greeting } from "../src";

describe("greeting", () => {
  it("should have a type", () => {
    expect(greeting.type).toEqual("greeting");
  });
});
