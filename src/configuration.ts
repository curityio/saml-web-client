/*
 * Client settings
 */
export class Configuration {
    public port = 3000;
    public issuer = 'saml-web-client';
    public samlSsoEndpoint = 'http://login.demo.example:8443/saml/sso';
    public callbackUrl = `/login/callback`;
    public signingCertPath = 'default-signing-key.pem';
}
