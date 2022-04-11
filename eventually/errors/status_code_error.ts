export class StatusCodeError extends Error {
  constructor(public readonly statusCode: string, message?: string) {
    super(message ?? `failed with status code ${statusCode}`);
  }
}
