# SAML 2.0 Web Client

[![Quality](https://img.shields.io/badge/quality-demo-red)](https://curity.io/resources/code-examples/status/)
[![Availability](https://img.shields.io/badge/availability-source-blue)](https://curity.io/resources/code-examples/status/)

A minimal web client that uses SAML to authenticate users at the Curity Identity Server.\
The app can use advanced authentication features and receives SAML assertions with user attriburtes.

![SAML app](app.png)

## How to Run the Code Example

### Prerequisites

First, get a license file for the Curity Identity Server with access to the SAML feature.\
Also make sure that Docker and the OpenSSL and jq command line tools are installed.

### Deploy the Curity Identity Server

Then run the deploy script to spin up a local server instance:

```bash
export LICENSE_FILE_PATH=~/Desktop/license-trial.json
./idsvr/deploy.sh
```

Sign in to the Admin UI at `https://localhost:6749/admin` with credentials `admin / Password1`.\
Use the facilities menu to export the certificate of the default signing key.\
Save it to the root folder of this project with the name `default-signing-key.pem`.

### Run the Web Application

Next, run the web application with the following commands:

```bash
npm install
npm start
```

Open the browser at `http://localhost:3000` and sign in as the pre-shipped user `demouser / Password1`.\
The app does a SAML login and receives a signed assertion with user attributes.\
The app then issues cookies and runs a web session that can use user attributes for authorization.

## Further Information

See the following related information for further SAML details:

- [SAML Website Code Example](https://curity.io/resources/learn/saml-web-client/)
- [Integrate a SAML Web Application](https://curity.io/resources/learn/saml-integration/)
