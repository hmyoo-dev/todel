/* eslint-disable @typescript-eslint/no-unused-vars */
import { Atom } from "./Atom";
import { Func } from "./types";

export enum AsyncStatus {
  Idle = "IDLE",
  Pending = "PENDING",
  Success = "SUCCESS",
  Failure = "FAILURE",
}

export interface AsyncAtomState {
  status: AsyncStatus;
  error: unknown | null;
}

export abstract class AsyncAtom<
  S extends AsyncAtomState = AsyncAtomState,
  Result = unknown
> extends Atom<S> {
  isPending(): boolean {
    return this.state.status === AsyncStatus.Pending;
  }

  isDone(): boolean {
    return this.state.status === AsyncStatus.Success;
  }

  isFailed(): boolean {
    return this.state.status === AsyncStatus.Failure;
  }

  async updateWith<T extends Result>(requestPromise: Promise<T>): Promise<T>;
  async updateWith<T>(
    requestPromise: Promise<T>,
    resultMapper: Func<T, Result>
  ): Promise<T>;
  async updateWith<T>(
    requestPromise: Promise<T>,
    resultMapper: Func<T, Result> = (r) => r as never
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

  protected updateStarted(state: S): S {
    return state;
  }

  protected updateDone(state: S, result: Result): S {
    return state;
  }

  protected updateFailed(state: S, error: unknown): S {
    return state;
  }

  private requestStarted(): void {
    this.updateState((state) => {
      state = { ...state, status: AsyncStatus.Pending, error: null };
      return this.updateStarted(state);
    });
  }

  private requestDone(result: Result): void {
    this.updateState((state) => {
      state = {
        ...state,
        status: AsyncStatus.Success,
        error: null,
      };
      return this.updateDone(state, result);
    });
  }

  private requestFailed(error: unknown): void {
    this.updateState((state) => {
      state = {
        ...state,
        status: AsyncStatus.Failure,
        error,
      };
      return this.updateFailed(state, error);
    });
  }
}

export function idleAsyncAtomState(): AsyncAtomState {
  return {
    status: AsyncStatus.Idle,
    error: null,
  };
}
