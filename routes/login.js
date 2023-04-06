/* ################################ SETTINGS ################################ */
const settings      = require('./../settings');

/* ################################ GENERAL ################################# */
const path              = require('path');

/* ################################ SERVER ################################## */
const express           = require('express');
const router            = express.Router();
const middleware        = require('./../src/middleware/middleware');

/* ################################ RENDER ENGINE ########################### */
const viewsPath         = path.join(__dirname, '..', 'views');
const eta               = require('eta');
eta.configure           ({ views: viewsPath });

/* ################################ ROUTE ################################### */
const route             = express(); route.use(router);

/* ################################ AUTH #################################### */
const jwt               = require('jsonwebtoken');
const users             = require('../database/userlist');
const bcrypt            = require('bcryptjs');


/* ######################################################################## */
/* ################################ END ################################### */
/* ######################################################################## */


route.get('/', [ middleware.user.get ], (req, res, next) => {
    if(req.user) return res.redirect('/');

    var templateData = {
      user: req.user
    };
  

    eta.renderFile(path.join(viewsPath, 'login'), templateData)
    .then(html => {
      res.status(200).send(html);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });

})


route.post('/', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).redirect('/login');
    }

    const user = users.find(u => (u.username).toLowerCase() === (req.body.username).toLowerCase());
    if (!user) {
      return res.status(400).redirect('/login');
    }
  
    bcrypt.compare(req.body.password, user.password, (err, match) => {
      if(match){
        const { password, ...userData } = {...user};
        const token = jwt.sign(userData, settings.auth.secret, { expiresIn: settings.auth.valid });
        res.cookie('user', token, { maxAge: settings.auth.valid });
        res.clearCookie('returnTo');
        return res.status(200).redirect(req.cookies.returnTo || '/');
      }else{
        return res.status(400).redirect('/login');
      }

    })
  
})


module.exports = route;