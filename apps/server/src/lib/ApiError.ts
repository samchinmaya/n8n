export function apiError(message: string, statusCode: number) {
  return {
    message,
    statusCode,
    success: false,
  };
}
