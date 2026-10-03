// Returns a plain object (not a class instance) so Elysia sends it as JSON
export function apiResponse<T>(statusCode: number, data: T, message = "Success") {
  return {
    statusCode,
    data,
    message,
    success: statusCode < 400,
  };
}
