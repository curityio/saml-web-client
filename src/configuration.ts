/*
 * Expose configuration settings from environment variables to the rest of the application
 */
export class Configuration {

    public port: string;
    public samlSsoEndpoint: string;
    public callbackUrl: string;
    public appEntityId: string;
    public issuerEntityId: string;
    public cookieSecret: string;
    public assertionVerificationCertificate: string;

    public constructor() {
        this.port = this.getValue('PORT');
        this.samlSsoEndpoint = this.getValue('SAML_SSO_ENDPOINT');
        this.callbackUrl = this.getValue('CALLBACK_URL');
        this.appEntityId = this.getValue('APP_ENTITY_ID');
        this.issuerEntityId = this.getValue('ISSUER_ENTITY_ID');
        this.cookieSecret = this.getValue('COOKIE_SECRET');
        this.assertionVerificationCertificate = this.getValue('ASSERTION_VERIFICATION_CERTIFICATE');
    }

    public isHttps(): boolean {
        return this.callbackUrl.toLowerCase().startsWith('https:');
    }

    private getValue(name: string): string {

        const value = process.env[name];
        if (!value) {
            throw new Error(`The environment variable ${name} has not been set`)
        }

        return value!;
    }
}
