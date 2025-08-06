import express from 'express';

import path from 'path';
import {Configuration} from './configuration.js';
import {SamlClient} from './samlClient.js';

const configuration = new Configuration();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const dirname = process.cwd();
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'ejs');

const samlClient = new SamlClient(configuration);
samlClient.initialize(app);

app.get('/', (request, response) => {
   response.render('index', request.query);
});

app.get('/login', samlClient.startLogin);
app.post('/login/callback', samlClient.endLogin);

app.listen(configuration.port, () => {
    console.log(`SAML web client is listening on HTTP port ${configuration.port}`);
});
