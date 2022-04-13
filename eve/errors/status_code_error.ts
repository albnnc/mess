export class StatusCodeError extends Error {
  constructor(public readonly statusCode: string, message?: string) {
    super(message ?? `Failed with status code ${statusCode}`);
  }
}
