export default class AppError extends Error {
  isFatal: boolean;
  constructor(message: string, error?: unknown, isFatal = false) {
    super(message);
    this.message =
      error instanceof Error ? message + ",\n" + error.message : message;
    this.isFatal = isFatal;
  }
}
