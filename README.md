# SAML 2.0 Website

[![Quality](https://img.shields.io/badge/quality-demo-red)](https://curity.io/resources/code-examples/status/)
[![Availability](https://img.shields.io/badge/availability-source-blue)](https://curity.io/resources/code-examples/status/)

A basic website that uses SAML to authenticate users at the Curity Identity Server.\
The code example demonstrates control over user attributes issued to SAML assertions.

![SAML app](app.png)

## How to Run the Code Example

Use the following commands to run a basic SAML flow on a local computer.

### Prerequisites

First, get a license file for the Curity Identity Server with access to the SAML feature.\
Also make sure that your local computer runs Docker, the OpenSSL tool and the jq tool.

### Deploy the Curity Identity Server

Then run the deploy script to spin up a local Curity Identity Server instance.

```bash
export LICENSE_FILE_PATH=~/Desktop/license-trial.json
./idsvr/deploy.sh
```

Sign in to the Admin UI at `https://localhost:6749/admin` with credentials `admin / Password1`.\
Use the facilities menu to view the certificate of the default signature verification key.\
The website downloads this certificate from the SAML metadata endpoint to validate SAML assertions.

### View Stored User Accounts

The example deployment stores user accounts in a Microsoft SQL Server database.\
The [Data Sources README](DATA-SOURCES.md) explains briefly how to connect to it and view user attributes.

### Run the SAML Website

Wait for a minute or so to ensure that the Curityy Identity Server and database are ready.\
Then run the SAML website with the following commands:

```bash
npm install
npm start
```

Open the browser at `http://localhost:3000` and sign in as the pre-shipped user `demouser / Password1`.\
The app runs a SAML login flow and receives a signed assertion with user attributes.\
The app then runs a cookie-based web session and can implement authorization with the user attributes.

## Website Documentation

See the following related information for further details on SAML integrations:

- [Integrate a SAML Web Application](https://curity.io/resources/learn/integrate-saml-website/)
- [SAML Website Code Example](https://curity.io/resources/learn/saml-website/)
- [Migrating from ADFS](https://curity.io/resources/learn/migrating-from-adfs/)

## Further Information

Please visit [curity.io](https://curity.io/) for further information about the Curity Identity Server.
