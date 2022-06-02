export default class AlreadyHandledError extends Error {
  constructor() {
    super('This request has already been handled');
  }
}
AlreadyHandledError.prototype.name = AlreadyHandledError.name;
