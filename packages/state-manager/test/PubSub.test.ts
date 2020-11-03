import { PubSub } from "../src/PubSub";

describe("PubSub", () => {
  it("should be subscribable", (done) => {
    const pubSub = new PubSub<number>();

    pubSub.subscribe((value) => {
      expect(value).toBe(123);
      done();
    });

    pubSub.publish(123);
  });

  it("should be unsubscribable", () => {
    let current = 0;
    const pubSub = new PubSub<number>();

    const subscription = pubSub.subscribe((value) => {
      current = value;
    });

    pubSub.publish(1);
    pubSub.publish(2);

    expect(current).toBe(2);

    subscription.unsubscribe();

    pubSub.publish(2);
    expect(current).toBe(2);
  });
});
