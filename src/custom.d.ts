declare namespace _ {
  interface LoDashStatic {
    combinations<T>(coll: List<T> | null | undefined, n: number): T[][];
  }

  interface Collection<T> {
    combinations(n: number): Collection<T[]>;
  }
}
