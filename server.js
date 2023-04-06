
/* ################################ SETTINGS ################################ */
const settings      = require('./settings');


/* ################################ GENERAL ################################# */
const path          = require('path');
const fs            = require('fs');


/* ################################ SERVER ################################## */
const express         = require('express');
const app             = express();
const middleware      = require('./src/middleware/middleware');
const cookieParser    = require('cookie-parser');
const cookieSession   = require('cookie-session');

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const publicPath = path.join(__dirname, 'public');
app.use(
  cookieSession({
    name: "cookieRulesBad",
    secret: settings.auth.secret,
    httpOnly: true
  })
);
app.use(express.static(publicPath, {
    redirect: false
}));


/* ################################ RENDER ENGINE ########################### */
const viewsPath = path.join(__dirname, 'views');
const eta = require('eta');
eta.configure({
  views: viewsPath,
  useWith: true,
  autoEscape: true,
  cache: false
});
app.set('view engine', 'eta');



/* ##### ##### ##### ##### DYNAMIC ADD WEBSERVER ROUTES ##### ##### ##### ##### */
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach(routeName => {
  if(routeName.split('.')[routeName.split('.').length - 1] !== "js") return;
  routeName = routeName.split('.')[0];
  
  // START IGNORE SAMPLE ROUTES
    if(routeName === "sample_public_route") return;
    if(routeName === "sample_private_route") return;
  // END IGNORE SAMPLE ROUTES
  if(routeName === "index") routeName = ""
  const route = require(path.join(routesPath, routeName));
  app.use(`/${routeName}`, route);
});



/* ##### ##### ##### ##### CATCH ALL 404 ##### ##### ##### ##### */
app.get('*', [ /* MIDDLEWARE */ ], function(req, res, next){
    if (res.headersSent) return;
  
    var templateData = {
      // you can pass data for the template right here
    };

    eta.renderFile(path.join(viewsPath, 'errors', '404'), templateData)
    .then(html => {
      res.status(404).send(html);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });

});




/* ##### ##### ##### ##### START SERVER ##### ##### ##### ##### */
app.listen(settings.server.port, (err) => {
    if (err) {
        console.log('Error: ', err)
    } else {
        console.log('Server is running on port: ', settings.server.port)
    }
})