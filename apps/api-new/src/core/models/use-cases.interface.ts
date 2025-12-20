export interface UseCases<Values = unknown, Result = unknown> {
  execute(values: Values): Promise<Result> | Result;
}
