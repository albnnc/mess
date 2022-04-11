export class ValidationError extends Error {
  constructor(message?: string) {
    super(message ?? "Data validation failed");
  }
}
