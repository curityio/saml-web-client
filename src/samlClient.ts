
import {Application, NextFunction, Request, Response} from 'express';
import fs from 'fs';
import passport, {AuthenticateOptions, PassportStatic} from 'passport';
import {Profile, SamlConfig, Strategy, VerifiedCallback} from 'passport-saml';
import {Configuration} from './configuration';

/*
 * Encapsulate SAML operations
 */
export class SamlClient {

    private readonly configuration: Configuration;

    public constructor(configuration: Configuration) {

        this.configuration = configuration;
        this.startLogin = this.startLogin.bind(this);
        this.endLogin = this.endLogin.bind(this);
        this.loginResponseVerifier = this.loginResponseVerifier.bind(this);
    }

    /*
     * Set SAML options and set up a login response verifier
     */
    public initialize(app: Application) {

        const options: SamlConfig = {
            issuer: this.configuration.issuer,
            //audience: '',
            entryPoint: this.configuration.samlSsoEndpoint,
            path: this.configuration.callbackUrl,
            cert: fs.readFileSync(this.configuration.signingCertPath, 'utf-8'),
            protocol: 'http://',
        };

        passport.use(new Strategy(options, this.loginResponseVerifier));
        app.use(passport.initialize());
    }

    /*
     * Send a login request as a GET
     */
    public startLogin(request: Request, response: Response, next: NextFunction) {

        const returnUrl = request.query.returnTo;
        request.query.RelayState = returnUrl;

        const options: AuthenticateOptions = {
            failureRedirect: '/error',
            failureFlash: true,
            //successRedirect: (request.query.returnTo as string) || '/',
        };

        const middleware = passport.authenticate('saml', options);
        middleware(request, response, next);
    }

    /*
     * Receive a login response as a POST
     */
    public endLogin(request: Request, response: Response, next: NextFunction) {

        const options: AuthenticateOptions = {
            failureRedirect: '/error',
            failureFlash: true,
        };
        
        console.log('endLoginStart');
        const middleware = passport.authenticate('saml', options);
        middleware(request, response, next);
        console.log('endLoginEnd');
        
        const returnUrl = request.body.RelayState as string;
        response.redirect(returnUrl || '/');
    }

    /*
     * Process the response assertion and update the session
     */
    private loginResponseVerifier(profile: Profile | null | undefined, done: VerifiedCallback): any {

        if (!profile) {
            return done(new Error('profile missing'), {});
        }

        const user = {
            id: profile['nameID'],
            email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
            firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
            assertionXml: profile.getAssertionXml!(),
        };
       
        console.log(JSON.stringify(user, null, 2));
        return done(null, user);
    }
}
