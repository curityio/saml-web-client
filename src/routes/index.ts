import {Request, Response} from 'express';

/*
 * Provide the model for the application's single view
 */
export function renderView(request: Request, response: Response) {

    // Add authenticated user information to the model
    const model: any = {
        isAuthenticated: request.isAuthenticated(),
        user: request.user || null,
        error: null,
    };
    
    // Add error information to the model
    const errorData = (request.session as any)?.error as string;
    if (errorData) {
        model.error = JSON.parse(errorData);
    }
    
    // Provide the model to the view, which uses data to control the partial views it renders
    response.render('index', { model });
}
