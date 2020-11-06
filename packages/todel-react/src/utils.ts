export function shallowEqual(prev: unknown, next: unknown): boolean {
  if (!(prev instanceof Object) || !(next instanceof Object)) {
    return prev === next;
  }

  for (const [key, value] of Object.entries(prev)) {
    if (value !== (next as Record<string, unknown>)[key]) {
      return false;
    }
  }

  return true;
}
