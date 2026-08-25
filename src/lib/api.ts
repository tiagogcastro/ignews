import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError, ZodType } from 'zod';

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

export function ok<T>(response: NextApiResponse, data: T, status = 200): void {
  response.status(status).json({ data });
}

export function fail(response: NextApiResponse, status: number, message: string): void {
  response.status(status).json({ error: { message } });
}

export function parseWith<T>(schema: ZodType<T>, payload: unknown): T {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const issue = result.error.issues[0];
    const location = issue?.path.join('.') || 'request';
    throw new ApiError(422, `Invalid ${location}`);
  }

  return result.data;
}

type RouteHandler = (
  request: NextApiRequest,
  response: NextApiResponse,
) => Promise<void>;

export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request, response) => {
    try {
      await handler(request, response);
    } catch (error) {
      if (error instanceof ApiError) {
        fail(response, error.statusCode, error.message);
        return;
      }

      if (error instanceof ZodError) {
        fail(response, 422, 'Invalid request payload');
        return;
      }

      console.error('[api] unhandled error:', error);
      fail(response, 500, 'Internal server error');
    }
  };
}
