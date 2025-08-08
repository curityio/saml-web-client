import express from 'express';
import path from 'path';
import {Configuration} from './configuration.js';
import {ExceptionHandler} from './errors/exceptionHandler.js';
import {renderView} from './routes/index.js';
import {handleLogout} from './routes/logout.js'
import {CookieHandler} from './security/cookieHandler.js';
import {SamlClient} from './security/samlClient.js';

/*
 * Base setup
 */
const configuration = new Configuration();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*
 * Configure the server side view engine
 */
const dirname = process.cwd();
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'ejs');

/*
 * Configure application level cookies
 */
const cookieHandler = new CookieHandler(configuration);
cookieHandler.initialize(app);

/*
 * Next apply SAML settings to Express
 */
const samlClient = new SamlClient(configuration);
samlClient.initialize(app);

/*
 * Render web resources and the application's single view
 */
app.use(express.static(path.join(dirname, 'public')));
app.get('/', renderView);

/*
 * Implement SAML flows and a simple logout
 */
app.get('/login', samlClient.startLogin);
app.post('/login/callback', samlClient.endLogin);
app.get('/logout', handleLogout);

/*
 * Handle errors
 */
const exceptionHandler = new ExceptionHandler();
app.use(exceptionHandler.onException);

/*
 * Start listening for web requests
 */
app.listen(configuration.port, () => {
    console.log(`SAML web client is listening on HTTP port ${configuration.port}`);
});
