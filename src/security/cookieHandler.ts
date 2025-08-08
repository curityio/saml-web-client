import {Application} from 'express';
import session, {CookieOptions, SessionOptions} from 'express-session';
import {Configuration} from '../configuration';

/*
 * Set up a cookie based session with backend storage
 */
export class CookieHandler {

    private readonly configuration: Configuration;

    public constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public initialize(app: Application) {

        const sessionTimeInHours = 1;
        const sessionTimeInMilliseconds = sessionTimeInHours * 60 * 60 * 1000;
        
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            sameSite: 'strict',
            secure: this.configuration.isHttps(),
            path: '/',
            maxAge: sessionTimeInMilliseconds,
        };
        
        const sessionOptions: SessionOptions = {
            resave: true,
            saveUninitialized: true,
            secret: this.configuration.cookieSecret,
            cookie: cookieOptions,
        };
        
        app.use(session(sessionOptions));
    }
}
