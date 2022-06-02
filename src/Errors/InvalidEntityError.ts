export default class InvalidEntityError extends Error {
  readonly errors: ReadonlyArray<readonly [key: string, message: string]>;
  constructor(
    entityName: string,
    errors: ReadonlyArray<readonly [key: string, message: string]>,
  ) {
    super(
      `${entityName} is invalid:\n${errors.map(
        ([key, msg]) => ` - ${key}: ${msg}`,
      )}`,
    );
    this.errors = errors;
  }
}
InvalidEntityError.prototype.name = InvalidEntityError.name;
