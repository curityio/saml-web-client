# Data Sources

The Curity Identity Server uses a number of abstractions to connect to data sources:

- [Data Sources](https://curity.io/docs/idsvr/latest/system-admin-guide/data-sources/index.html)
- [Account Managers](https://curity.io/docs/idsvr/latest/authentication-service-admin-guide/account-managers/index.html)
- [Credential Managers](https://curity.io/docs/idsvr/latest/system-admin-guide/credential-managers/index.html)

To integrate user accounts and user credentials you can choose one of the following approaches:

- Connect the Curity Identity Server to existing data sources, like LDAP stores.
- Use [User Management APIs](https://curity.io/resources/learn/managing-users-with-scim/) to migrate user accounts and user credentials to the Curity Identity Server.

It is possible to enable use cases like user migrations that do not require users to reset existing passwords.

## Example Database

The example deployment uses a standalone PostgreSQL database with a test user account of `demouser`.\
To query its data, first get a shell to the database container:

```bash
export CONTAINER_ID=$(docker ps | grep curity-data | awk '{print $1}')
docker exec -it $CONTAINER_ID bash
```

Then connect to a database query tool:


```bash
export PGPASSWORD=Password1 && psql -p 5432 -d idsvr -U postgres
```

An attribute value provider runs the following query to get attributes to issue to SAML assertions.\
Since attributes are stored as JSON, the query uses PostgreSQL's support for querying JSON text fields.

```sql
SELECT *, 
attributes->'name'->'givenName' as given_name,
attributes->'name'->'familyName' as family_name,
attributes->'region'
as region from accounts WHERE username = 'demouser';
```
