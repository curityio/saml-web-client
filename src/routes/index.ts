import {Request, Response} from 'express';

/*
 * Provide the model for the application's single view
 */
export function renderView(request: Request, response: Response) {

    // Add authenticated user information to the model
    const model: any = {
        isAuthenticated: request.isAuthenticated(),
        user: request.user || null,
        errorMessage: null,
    };
    
    // Add error information to the model
    const errorMessage = (request.session as any)?.errorMessage;
    if (errorMessage) {
        model.errorMessage = errorMessage;
    }
    
    // Provide the model to the view, which uses data to control the partial views it renders
    response.render('index', { model });
}
