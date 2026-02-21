import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    // Always log the full error internally for diagnostics
    console.error('[Error]', req.method, req.path, err.stack ?? err.message);

    const isProd = process.env.NODE_ENV === 'production';

    res.status(err.status ?? 500).json({
        message: 'Internal Server Error',
        // In production: return nothing. In development: return a generic
        // description — NOT err.message, which can leak internal details
        // (e.g. raw origin strings, SQL errors, file paths).
        ...(isProd ? {} : { detail: 'An unexpected error occurred. Check server logs.' }),
    });
};
