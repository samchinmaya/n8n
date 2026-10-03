export class ApiError extends Error{
  statusCode: number;
  errors: unknown[];
  success: false;
  constructor(message: string, statusCode: number, errors: unknown[]=[]) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    this.errors = errors;
    this.success = false;
  }
}
