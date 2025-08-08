import {Request, Response} from 'express';

/*
 * Implement a simple logout that ends the web session
 */
export function handleLogout(request: Request, response: Response) {
    (request.session as any)?.destroy();
    response.redirect('/');
}
