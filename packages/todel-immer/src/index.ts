import { produce, Draft } from "immer";

export interface StateRecipe<S> {
  (draft: Draft<S>): S | void;
}

export function withDraft<S>(recipe: StateRecipe<S>): (state: S) => S {
  return (state) => {
    return produce(state, recipe) as S;
  };
}
