import {
  AsyncAtom,
  AsyncAtomState,
  AsyncStatus,
  idleAsyncAtomState,
} from "../../src/AsyncAtom";

export interface Author {
  name: string;
}

export interface AuthorAtomState extends AsyncAtomState {
  author: Author | null;
}

const idleState: AuthorAtomState = {
  ...idleAsyncAtomState(),
  author: null,
};

export class AuthorAtom extends AsyncAtom<AuthorAtomState, Author> {
  static idle(): AuthorAtom {
    return new AuthorAtom({ ...idleState });
  }

  static pending(): AuthorAtom {
    return new AuthorAtom({
      ...idleState,
      status: AsyncStatus.Pending,
    });
  }

  static done(author: Author): AuthorAtom {
    return new AuthorAtom({
      ...idleState,
      status: AsyncStatus.Success,
      author,
      error: null,
    });
  }

  static failed(): AuthorAtom {
    return new AuthorAtom({
      ...idleState,
      status: AsyncStatus.Failure,
      error: new Error("Failed"),
    });
  }

  protected updateStarted(state: AuthorAtomState): AuthorAtomState {
    return { ...state, author: null };
  }

  protected updateDone(
    state: AuthorAtomState,
    author: Author
  ): AuthorAtomState {
    return { ...state, author };
  }

  protected updateFailed(state: AuthorAtomState): AuthorAtomState {
    return { ...state, author: null };
  }
}

interface SimpleAsyncAtomState extends AsyncAtomState {
  value: string;
}
export class SimpleAsyncAtom extends AsyncAtom<SimpleAsyncAtomState> {
  static idle(value: string): SimpleAsyncAtom {
    return new SimpleAsyncAtom({ ...idleAsyncAtomState(), value });
  }
}
