/*
 * Expose configuration settings from environment variables to the rest of the application
 */
export class Configuration {

    public port: string;
    public useHttps: boolean;
    public entityId: string;
    public samlSsoEndpoint: string;
    public callbackUrl: string;
    public cookieEncryptionKey: string;
    public assertionVerificationCertificate: string;

    public constructor() {
        this.port = this.getValue('PORT');
        this.useHttps = this.getValue('HTTPS') !== 'false';
        this.entityId = this.getValue('ENTITY_ID');
        this.samlSsoEndpoint = this.getValue('SAML_SSO_ENDPOINT');
        this.callbackUrl = this.getValue('CALLBACK_URL');
        this.cookieEncryptionKey = this.getValue('COOKIE_ENCRYPTION_KEY');
        this.assertionVerificationCertificate = this.getValue('ASSERTION_VERIFICATION_CERTIFICATE');
    }

    private getValue(name: string): string {

        const value = process.env[name];
        if (!value) {
            throw new Error(`The environment variable ${name} has not been set`)
        }

        return value!;
    }
}
