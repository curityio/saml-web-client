/*
 * Expose configuration settings from environment variables to the rest of the application
 */
export class Configuration {

    public port: string;
    public samlSsoEndpoint: string;
    public samlMetadataEndpoint: string;
    public callbackUrl: string;
    public entityId: string;
    public cookieSecret: string;

    public constructor() {
        this.port = this.getValue('PORT');
        this.samlSsoEndpoint = this.getValue('SAML_SSO_ENDPOINT');
        this.samlMetadataEndpoint = this.getValue('SAML_METADATA_ENDPOINT');
        this.entityId = this.getValue('ENTITY_ID');
        this.callbackUrl = this.getValue('CALLBACK_URL');
        this.cookieSecret = this.getValue('COOKIE_SECRET');
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
