# SAML 2.0 Web Client

A minimal web client that uses SAML to authenticate users at the Curity Identity Server.\
The example also demonstrates an approach to migrate from older identity systems.

## How to Run the Web Applications

First, get a license file for the Curity Identity Server with access to the SAML feature.\
Then run the deploy script to spin up a local server instance:

```bash
export LICENSE_FILE_PATH=~/Desktop/license-trial.json
./idsvr/deploy.sh
```

Next, run the web application to run a SAML flow.\
The app does SAML logins, renders user attributes, issues cookies and does a SAML logout.

```bash
npm install
npm start
```

## Further Information

See the following related information for SAML and the Curity Identity Server:

- [SAML Website Code Example](https://curity.io/resources/learn/saml-web-client/)
- [Integrate a SAML Web Application](https://curity.io/resources/learn/saml-integration/)
- [Use SAML and OAuth Together](https://curity.io/resources/learn/saml-and-oauth/)
