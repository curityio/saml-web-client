
DECLARE @attributes VARCHAR(MAX) = '{"emails":[{"value":"demo@user.com","primary":true}],"phoneNumbers":[{"value":"07711","primary":true}],"name":{"givenName":"Demo","familyName":"User"},"agreeToTerms":"on", "region":"USA"}'
INSERT INTO accounts(account_id, username, email, phone, attributes, active, created, updated) VALUES('812F174E-FB24-432E-ACDC-543DBF2BED77', 'demouser', 'demo@user.com', '07711', @attributes, 1, 1754898809, 1754898809)
GO

INSERT INTO credentials (id, subject, password, attributes, created, updated)
VALUES('0C7A8B3B-6C23-42AD-AC90-6BEC3519E553', 'demouser', '$5$rounds=20000$x0exE6bNk4lHo5dV$kDWlud0M1ig8zZbkG7xLKC9D2pbImXdUDhlRrzoEU94', '{}', '2025-08-11 07:53:29.857', '2025-08-11 07:53:29.857')
GO
