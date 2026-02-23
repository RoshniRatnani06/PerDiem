import { Request, Response, NextFunction } from 'express';

/**
 * Structured request logger middleware.
 * Logs: method, path, status code, and duration in milliseconds as JSON.
 * This supplements Morgan's dev format with a machine-readable format
 * suitable for log aggregation tools.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    // Hook into the response finish event to capture the final status
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logEntry = {
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            query: req.query,
            status: res.statusCode,
            duration_ms: duration,
        };
        console.log(JSON.stringify(logEntry));
    });

    next();
}
