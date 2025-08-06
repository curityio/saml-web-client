import cookieParser from 'cookie-parser';
import {Application} from 'express';
import session, {CookieOptions, SessionOptions} from 'express-session';
import {Configuration} from './configuration';

/*
 * Set up a cookie based session with backend storage
 */
export class CookieHandler {

    private readonly configuration: Configuration;

    public constructor(configuration: Configuration) {
        this.configuration = configuration;
    }

    public initialize(app: Application) {

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            sameSite: 'strict',
            secure: this.configuration.useHttps,
            path: '/',
        };
        
        const sessionOptions: SessionOptions = {
            resave: true,
            saveUninitialized: true,
            secret: this.configuration.cookieEncryptionKey,
            cookie: cookieOptions,
        };
        
        app.use(cookieParser());
        app.use(session(sessionOptions));
    }
}
