import { Atom } from "./Atom";
import { Func } from "./types";

export enum AjaxStatus {
  Idle = "IDLE",
  Pending = "PENDING",
  Success = "SUCCESS",
  Failure = "FAILURE",
}

export interface AjaxAtomState<T> {
  value: T;
  status: AjaxStatus;
  error: unknown | null;
}

export abstract class AjaxAtom<
  V,
  S extends AjaxAtomState<V> = AjaxAtomState<V>
> extends Atom<S> {
  private _initValue: V;

  constructor(initState: S) {
    super(initState);
    this._initValue = initState.value;
  }

  protected get defaultValue(): V {
    return this._initValue;
  }

  isPending(): boolean {
    return this.state.status === AjaxStatus.Pending;
  }

  isDone(): boolean {
    return this.state.status === AjaxStatus.Success;
  }

  isFailed(): boolean {
    return this.state.status === AjaxStatus.Failure;
  }

  async updateWith<T extends V>(requestPromise: Promise<T>): Promise<T>;
  async updateWith<R, T extends V>(
    requestPromise: Promise<R>,
    resultMapper: Func<R, T>
  ): Promise<R>;
  async updateWith<T extends V>(
    requestPromise: Promise<T>,
    resultMapper: Func<T, T> = (r) => r
  ): Promise<T> {
    this.requestStarted();
    try {
      const result = await requestPromise;
      this.requestDone(resultMapper(result));
      return result;
    } catch (err) {
      this.requestFailed(err);
      throw err;
    }
  }

  requestStarted(): void {
    this.updateState((state) => ({
      ...state,
      value: this.defaultValue,
      status: AjaxStatus.Pending,
      error: null,
    }));
  }

  requestDone(value: V): V {
    this.updateState((state) => ({
      ...state,
      value,
      status: AjaxStatus.Success,
      error: null,
    }));

    return value;
  }

  requestFailed(error: unknown): void {
    this.updateState((state) => ({
      ...state,
      value: this.defaultValue,
      status: AjaxStatus.Failure,
      error,
    }));
  }
}

export function idleAjaxAtomState<T>(value: T): AjaxAtomState<T> {
  return {
    value,
    status: AjaxStatus.Idle,
    error: null,
  };
}
