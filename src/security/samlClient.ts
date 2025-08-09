
import {Application, NextFunction, Request, Response} from 'express';
import passport, {AuthenticateOptions} from 'passport';
import {Profile, SamlConfig, Strategy, VerifiedCallback} from 'passport-saml';
import {Configuration} from '../configuration';

/*
 * Encapsulate SAML operations
 */
export class SamlClient {

    private readonly configuration: Configuration;

    public constructor(configuration: Configuration) {

        this.configuration = configuration;
        this.startLogin = this.startLogin.bind(this);
        this.endLogin = this.endLogin.bind(this);
        this.receiveUserAttributes = this.receiveUserAttributes.bind(this);
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
            
            // The client details
            issuer: this.configuration.entityId,
            entryPoint: this.configuration.samlSsoEndpoint,
            callbackUrl: this.configuration.callbackUrl,
            
            // Details used to validate received SAML assertions
            audience: this.configuration.entityId,
            cert: this.configuration.assertionVerificationCertificate,

            // This example forces a login on every redirect
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
            passReqToCallback: true,
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
            passReqToCallback: true,
            successRedirect: '/',
        };
        
        const middleware = passport.authenticate('saml', options);
        middleware(request, response, next);
    }

    /*
     * Receive user attributes after the SAML library has validated the assertion and implement any custom validations
     */
    private receiveUserAttributes(profile: Profile | null | undefined, done: VerifiedCallback): any {

        if (!profile || !profile.getAssertion) {
            return done(new Error('An invalid SAML response was received'), {});
        }

        // Create an application object with the user ID and any custom attributes configured in the Curity Identity Server
        const user = {
            nameID: profile['nameID'],
            attributes: profile.attributes || [],
        };

        // View the underlying assertion if required
        // console.log(JSON.stringify(profile.getAssertion(), null, 2));

        return done(null, user);
    }
}
