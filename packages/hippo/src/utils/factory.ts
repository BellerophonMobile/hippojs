export interface Algorithm {
  readonly algorithm: string
}

/* AlgorithmFactory is a helper to add and get algorithm implementations. */
export class AlgorithmFactory<T extends Algorithm> {

  constructor(...items: T[]) {
    items.forEach(i => this.add(i))
  }

  private readonly registry = new Map<string, T>()

  protected static algorithmsMatch(a: Algorithm, b: Algorithm) {
    if (a.algorithm !== b.algorithm) {
      throw new Error(`algorithm mismatch: "${a.algorithm}" !== "${b.algorithm}"`)
    }
  }

  /* add adds the given algorithm to the factory. */
  add(item: T): void {
    this.registry.set(item.algorithm, item)
  }

  /* get retrieves the given algorithm from the factory. */
  get(algorithm: string): T {
    const item = this.registry.get(algorithm)
    if (!item) {
      throw new Error(`unknown algorithm: "${algorithm}"`)
    }
    return item
  }

}
