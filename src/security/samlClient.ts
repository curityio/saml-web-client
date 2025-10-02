
import {Profile, SamlConfig, Strategy, VerifiedCallback} from '@node-saml/passport-saml';
import {Application, NextFunction, Request, Response} from 'express';
import passport, {AuthenticateOptions} from 'passport';
import convert from 'xml-js';
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
        this.getIdpCert = this.getIdpCert.bind(this);
        this.signOnVerify = this.signOnVerify.bind(this);
        this.signOutVerify = this.signOutVerify.bind(this);
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

            // Set details to validate received SAML assertions
            audience: this.configuration.entityId,
            identifierFormat: null,
            idpCert: this.getIdpCert,

            // This example forces a login on every redirect
            forceAuthn: true,
        };

        const strategy = new Strategy(options, this.signOnVerify, this.signOutVerify);
        passport.use(strategy as any);
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
     * The node SAML library uses old callback functions and calls promisify on this function.
     * To avoid a warning, do the async download in a separate async function.
     */
    private getIdpCert(setPublicKey: (err: Error | null, publicCert?: string | string[]) => void) {
                
        (async () => {
        
            try {
                const cert = await this.downloadAssertionSigningCertificate();
                setPublicKey(null, cert);

            } catch (e: any) {
                setPublicKey(e);
            };

        })();
    }

    /*
     * Do the work of downloading the certificate that corresponds to the SAML assertion signing key
     */
    private async downloadAssertionSigningCertificate(): Promise<string> {

        const response = await fetch(this.configuration.samlMetadataEndpoint);
        if (response.status !== 200) {
            throw new Error(`Status ${response.status} downloading SAML metadata`);
        }
        
        const xmlText = await response.text();
        var json = convert.xml2json(xmlText, {compact: true});
        
        var data = JSON.parse(json);
        const cert = data.EntityDescriptor?.IDPSSODescriptor?.KeyDescriptor?.X509Data?.X509Certificate?._text;
        if (!cert) {
            throw new Error('No public key certificate was found in the SAML metadata');
        }

        return '-----BEGIN CERTIFICATE-----\n' + cert.match(/.{1,64}/g).join('\n') + '\n-----END CERTIFICATE-----';
    }

    /*
     * Receive user attributes after the SAML library has validated the assertion and implement any custom validations
     */
    private signOnVerify(profile: Profile | null | undefined, done: VerifiedCallback): any {

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

    /*
     * Default handling of logout responses
     */
    private signOutVerify(profile: Profile | null | undefined, done: VerifiedCallback): any {
        return done(null, {});
    }
}
