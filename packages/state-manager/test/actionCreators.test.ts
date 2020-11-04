import { actionCreator, prepareActionCreator } from "../src/actionCreators";
import type { Action } from "../src/types";

describe("actionCreator", () => {
  it("can create non payload action", () => {
    const hello = actionCreator("hello");
    expect(hello().type).toEqual("hello");
  });

  it("can create typed payload action", () => {
    const setCount = actionCreator<number>("setCount");
    expect(setCount(12).payload).toEqual(12);
  });

  it("should return with default meta object", () => {
    const nothing = actionCreator("nothing");
    expect(nothing().meta).toEqual({});
  });

  it("can set meta data", () => {
    const log = actionCreator("log", { log: true });
    const noLog = actionCreator<{ log: boolean }>("log", { log: false });

    expect(log().meta.log).toBe(true);
    expect(noLog().meta.log).toBe(false);
  });

  it("should match action with type guard", (done) => {
    const send = actionCreator<{ message: string }>("send");
    const action: Action = send({ message: "test" });

    if (send.match(action)) {
      expect(action.payload.message).toEqual("test");
      done();
    }
  });
});

describe("prepareActionCreator", () => {
  interface Msg {
    content: string;
  }

  it("can create non parameter action", () => {
    const hello = prepareActionCreator("hello", () => ({ content: "Hello" }));
    const bye = prepareActionCreator<Msg>("bye", () => ({ content: "Bye" }));

    expect(hello().payload.content).toEqual("Hello");
    expect(bye().payload.content).toEqual("Bye");
  });

  it("can create action with typed parameter", () => {
    const hello = prepareActionCreator("hello", (name: string) => ({
      content: `Hello ${name}`,
    }));
    const bye = prepareActionCreator<Msg, string>("bye", (name: string) => ({
      content: `Bye ${name}`,
    }));

    expect(hello("world").payload.content).toEqual("Hello world");
    expect(bye("world").payload.content).toEqual("Bye world");
  });

  it("should return with default meta", () => {
    const nothing = prepareActionCreator("nothing", () => "");
    expect(nothing().meta).toEqual({});
  });

  it("can set meta", () => {
    const log = prepareActionCreator("log", () => "", { log: true });
    const noLog = prepareActionCreator<{ log: boolean }, string>(
      "log",
      () => "",
      { log: false }
    );

    expect(log().meta.log).toBe(true);
    expect(noLog().meta.log).toBe(false);
  });

  it("should support match method", (done) => {
    const send = prepareActionCreator("send", () => ({ message: "test" }));
    const action: Action = send();

    if (send.match(action)) {
      expect(action.payload.message).toEqual("test");
      done();
    }
  });
});
