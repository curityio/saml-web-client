import {Request, Response} from 'express';

/*
 * Provide the model for the application's single view
 */
export function renderView(request: Request, response: Response) {

    // Include authenticated user information in the model
    const model: any = {
        isAuthenticated: request.isAuthenticated(),
        user: request.user || null,
        error: null,
    };
    
    // Provide error information in the model
    const errorData = (request.session as any)?.error;
    if (errorData) {
        model.error = JSON.parse(errorData);
    }
    
    // Provide the model to the view, to control the partial views it renders
    response.render('index', { model });
}
