import {NextFunction, Request, Response} from 'express';
import {AppError} from './appError.js';

/*
 * Intercept errors to productively troubleshoot SAML and other errors
 */
export class ExceptionHandler {

    public constructor() {
        this.onException = this.onException.bind(this);
        this.onNotFound = this.onNotFound.bind(this);
    }

    public async onException(exception: any, request: Request, response: Response, next: NextFunction) {
        
        const data: AppError = {
            status: 500,
            code: 'server_error',
            message: exception.message || 'Server problem encountered',
        };
        
        this.logError(request, data);
        response.redirect('/');
    }

    public async onNotFound(request: Request, response: Response, next: NextFunction) {
        
        const data: AppError = {
            status: 404,
            code: 'invalid_path',
            message: 'Application path not found',
        };
        
        this.logError(request, data);
        response.redirect('/');
    }

    private async logError(request: Request, data: AppError) {
        
        (request.session as any).error = JSON.stringify(data);
        
        await new Promise<void>((resolve) => {
            request.session.save((err: any) => {
                resolve();
            });
        });

        console.log(JSON.stringify(data, null, 2));
    }
}
