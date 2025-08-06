
import {Application, NextFunction, Request, Response} from 'express';
import passport, {AuthenticateOptions} from 'passport';
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
    }

    /*
     * Set SAML options and set up a login response verifier
     */
    public initialize(app: Application) {

        passport.serializeUser((user: any, done) => {
            done(null, user);
        });
        passport.deserializeUser((user: any, done) => {
            done(null, user);
        });

        const options: SamlConfig = {
            
            // Endpoints
            entryPoint: this.configuration.samlSsoEndpoint,
            callbackUrl: this.configuration.callbackUrl,
            
            // The issuer to send in requests, the audience to check in responses and crypto verification details
            issuer: this.configuration.entityId,
            audience: this.configuration.entityId,
            cert: this.configuration.assertionVerificationCertificate,
            signatureAlgorithm: 'sha256',

            // This example forces a login on evert redirect
            forceAuthn: true,
        };

        passport.use(new Strategy(options, this.receiveUserAttributes));
        app.use(passport.initialize());
        app.use(passport.session());
    }

    /*
     * Send a login request as a GET
     */
    public startLogin(request: Request, response: Response, next: NextFunction) {

        const options: AuthenticateOptions = {
            successRedirect: '/',
        };

        const middleware = passport.authenticate('saml', options);
        middleware(request, response, next);
    }

    /*
     * Receive a login response as a POST
     */
    public endLogin(request: Request, response: Response, next: NextFunction) {

        const options: AuthenticateOptions = {
            successRedirect: '/',
        };
        
        const middleware = passport.authenticate('saml', options);
        middleware(request, response, next);
    }

    /*
     * Receive user attributes after the SAML library has validated the assertion
     */
    private receiveUserAttributes(profile: Profile | null | undefined, done: VerifiedCallback): any {

        if (!profile) {
            return done(new Error('The profile is missing in getUser'), {});
        }

        const user = {
            id: profile['nameID'],
            email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
            firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
            assertionXml: profile.getAssertion!(),
        };
       
        return done(null, user);
    }
}
