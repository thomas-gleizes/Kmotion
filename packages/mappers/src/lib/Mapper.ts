export abstract class Mapper<Input, Output> {
  abstract one(input: Input): Output

  public many(inputs: Input[]): Output[] {
    return inputs.map((input) => this.one(input))
  }
}
