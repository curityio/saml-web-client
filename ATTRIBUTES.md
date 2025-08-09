# User Attributes

The deployment includes a test user account called `demouser`, stored in a PostgreSQL database.\
To query its data, first get a shell to the database container:

```bash
export CONTAINER_ID=$(docker ps | grep curity-data | awk '{print $1}')
docker exec -it $CONTAINER_ID bash
```

Then connect to a database query tool:


```bash
export PGPASSWORD=Password1 && psql -p 5432 -d idsvr -U postgres
```

An attribute value provider runs the following query to get attributes to issue to the SAML assertion.\
Since attributes are stored as JSON, the query uses PostgreSQL's support for querying JSON text fields.

```sql
SELECT *, 
attributes->'name'->'givenName' as given_name,
attributes->'name'->'familyName' as family_name,
attributes->'region'
as region from accounts WHERE username = 'demouser';
```
