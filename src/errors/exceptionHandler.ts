import {NextFunction, Request, Response} from 'express';

/*
 * Intercept errors to productively troubleshoot SAML and other errors
 */
export class ExceptionHandler {

    public constructor() {
        this.onException = this.onException.bind(this);
    }

    public async onException(exception: any, request: Request, response: Response, next: NextFunction) {
        
        this.logError(request, exception.message || 'Server problem encountered');
        response.redirect('/');
    }

    private async logError(request: Request, message: string) {
        
        (request.session as any).errorMessage = message;
        
        await new Promise<void>((resolve) => {
            request.session.save((err: any) => {
                resolve();
            });
        });

        console.log(message);
    }
}
