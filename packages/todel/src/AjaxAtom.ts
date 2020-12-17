import { Atom } from "./Atom";

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

export interface AjaxAtomBaseData {
  isPending(): boolean;
  isDone(): boolean;
  isFailed(): boolean;
}

export abstract class AjaxAtom<
  V,
  S extends AjaxAtomState<V> = AjaxAtomState<V>,
  C = unknown
> extends Atom<S, AjaxAtomBaseData & C> {
  private _initValue: V;

  constructor(initState: S) {
    super(initState);
    this._initValue = initState.value;
  }

  protected get defaultValue(): V {
    return this._initValue;
  }

  protected get computed(): AjaxAtomBaseData & C {
    return {
      isPending: () => this.state.status === AjaxStatus.Pending,
      isDone: () => this.state.status === AjaxStatus.Success,
      isFailed: () => this.state.status === AjaxStatus.Failure,
    } as AjaxAtomBaseData & C;
  }

  async updateWith<T extends V>(requestPromise: Promise<T>): Promise<T> {
    this.requestStarted();
    try {
      const result = await requestPromise;
      this.requestDone(result);
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
