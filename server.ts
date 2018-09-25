//A Universal web server responds to application page requests with static 
//HTML rendered by the Universal template engine

//It receives and responds to HTTP requests from clients (usually browsers). 
//It serves static assets such as scripts, css, and images. It may respond to data requests, 
//perhaps directly or as a proxy to a separate data server.

//This sample server is not secure! Be sure to add middleware to authenticate and authorize users 
//just as you would for a normal Angular application server.


// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
 
import { enableProdMode } from '@angular/core';
 
import * as express from 'express';
import { join } from 'path';
 
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();
 
// Express server
const app = express();
 
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');
 
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');
 
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

//See Image for explanation on why this is the most important
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));
 
app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));
 
// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});
 
// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));
 
// All regular routes use the Universal engine
//The following code filters for request URLs with no extensions and treats them as navigation requests.
app.get('*', (req, res) => {
  res.render('index', { req });
});
 
// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});