# PME Storyline

- You can modernize security for new applications while still running old apps.
- You can migrate from old identity systems like ADFS.
- Both SAML and OAuth apps can use modern authentication from the Curity Identity Server.

## Code Example

If I can keep this simple I might add a code example website resource:

- Anyone can run it
- Implements mainstream SAML flows
- Stress flexible implementations
- Shows how to update from ADFS by just changing configuration?

## SAML

Read System Admin guide and also read up on ADFS 4.0:

- https://bitbucket.org/curity/identity-server/src/dev/docs/source/samlidp-service-admin-guide/

Understand:

- Metadata and verification keys
- Security choices

## Node.js Tech

The passport SAML notes include notes on ADFS:

- https://www.passportjs.org/packages/passport-saml/
- https://github.com/liupeirong/SAML-Sample-Azure-AD
- https://github.com/passport/todos-express-auth0

## Tasks

- Make assertion validation fail

- Finalize cookie encryption key

- Get additional user attributes returned in SAML assertion and render them

- Get logout working across multiple tabs

- Add CSS styles
