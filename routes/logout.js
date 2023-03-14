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


/* ######################################################################## */
/* ################################ END ################################### */
/* ######################################################################## */


route.get('/', [ ], (req, res, next) => {

    res.clearCookie('user');
    return res.status(200).redirect('/');
    
})


module.exports = route;