import { ActionHandler, AtomDict, Store } from "todel";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFunc = (...args: any[]) => any;

export function mockMethod<
  T,
  K extends keyof T,
  F extends T[K] extends AnyFunc ? T[K] : never
>(instance: T, method: K): jest.Mock<ReturnType<F>> {
  const mock = jest.fn();
  instance[method] = mock as never;
  return mock;
}

export function mockStore<Atoms extends AtomDict = AtomDict>(
  atoms: Atoms,
  actionHandler: ActionHandler = jest.fn()
): Store<Atoms> {
  return new Store({ atoms, actionHandler });
}
