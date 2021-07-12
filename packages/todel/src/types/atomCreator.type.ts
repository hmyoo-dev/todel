import type {
  JsonSerializable,
  PickOnlyExtended,
  SelfSubscribable,
} from "./common.type";

type ConditionalPartial<T, R> = Partial<T> extends T ? Partial<R> : R;
type OptionalVoid<T> = Partial<T> extends T ? void | T : T;

export interface AtomDraft<State, M> extends Partial<JsonSerializable> {
  initState: State;
  meta?: M;
}

export type Atom<
  State,
  M,
  Draft extends AtomDraft<State, M> = AtomDraft<State, M>
> = Draft & {
  state: State;
  meta: M;
} & JsonSerializable &
  SelfSubscribable<[string | null]>;

export interface AtomSetupPayload<State, Deps = void> {
  deps: Deps;
  initState?: State;
  getState: () => State;
  setState: (modifier: StateModifier<State>, memo?: string) => void;
}

export interface AtomDict {
  [key: string]: AnyAtom | AtomDict;
}

export interface StateModifier<Draft> {
  (current: Draft): Draft | void;
}

export interface AsyncStateModifiers<Result, Draft> {
  promise: Promise<Result>;
  memo?: string;
  started?: StateModifier<Draft>;
  done?: (state: Draft, result: Result) => Draft | void;
  failed?: (state: Draft, err: unknown) => Draft | void;
}

export interface AtomSetup<State, M, Deps, Result extends AtomDraft<State, M>> {
  (payload: AtomSetupPayload<State, Deps>): Result;
}

export type AtomCreatorPayload<State, Deps = void> = {
  initState?: State;
} & ConditionalPartial<Deps, { deps: Deps }>;

export interface AtomCreator<State, M, Deps, A extends Atom<State, M>> {
  (payload: OptionalVoid<AtomCreatorPayload<State, Deps>>): A;
}

export interface AtomDevtoolOption {
  ignoreUpdate?: boolean;
}

export interface AtomMeta {
  devtool?: AtomDevtoolOption;
}

export enum AtomMethodKind {
  Computed = "computed",
  Modifier = "modifier",
}

export interface MethodKindHolder<Kind extends AtomMethodKind> {
  methodKind: Kind;
}
export type AtomMethod<Kind extends AtomMethodKind, F> = F &
  MethodKindHolder<Kind>;

export type AtomKindAdder<Kind extends AtomMethodKind> = <F>(
  func: F
) => AtomMethod<Kind, F>;

export type AtomMethodKindChecker<Kind extends AtomMethodKind> = <F>(
  func: F
) => func is AtomMethod<Kind, F>;

export type AtomComputedMethod<F> = AtomMethod<AtomMethodKind.Computed, F>;
export type AtomModifierMethod<F> = AtomMethod<AtomMethodKind.Modifier, F>;

export type AnyAtom = Atom<unknown, unknown>;

export type ReadableAtom<A extends AnyAtom> = PickOnlyExtended<
  A,
  MethodKindHolder<AtomMethodKind.Computed>
> & { state: A["state"] };

export type WritableAtom<A extends AnyAtom> = PickOnlyExtended<
  A,
  MethodKindHolder<AtomMethodKind.Modifier>
>;

export type ReadableAtoms<A extends AnyAtom[]> = {
  [K in keyof A]: K extends number ? ReadableAtom<A[K]> : A[K];
};
