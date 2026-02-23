import { Request, Response, NextFunction } from 'express';
import { SquareError } from 'square';

/**
 * Structured API error returned to clients.
 */
export interface ApiError {
  status: number;
  code: string;
  message: string;
}

/**
 * Creates a clean ApiError from any thrown value.
 * Maps Square SDK error categories to appropriate HTTP status codes.
 */
export function buildApiError(error: unknown): ApiError {
  if (error instanceof SquareError) {
    // Extract the first error detail from Square's response if available
    const squareErrors = (error as any).errors as Array<{ category?: string; detail?: string }> | undefined;
    const firstError = squareErrors?.[0];
    const detail = firstError?.detail || error.message || 'Square API error';
    const category = firstError?.category ?? '';

    // Map Square error categories to HTTP status codes
    const statusMap: Record<string, number> = {
      AUTHENTICATION_ERROR: 401,
      INVALID_REQUEST_ERROR: 400,
      RATE_LIMIT_ERROR: 429,
      PAYMENT_METHOD_ERROR: 402,
      REFUND_ERROR: 400,
      NOT_FOUND: 404,
    };

    const status = statusMap[category] ?? 500;
    const code = category || 'SQUARE_ERROR';

    return { status, code, message: detail };
  }

  if (error instanceof Error) {
    return { status: 500, code: 'INTERNAL_ERROR', message: error.message };
  }

  return { status: 500, code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' };
}

/**
 * Express error-handling middleware.
 * Converts any error thrown in route handlers into a clean JSON response.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const apiError = buildApiError(err);
  res.status(apiError.status).json({ error: apiError });
}
