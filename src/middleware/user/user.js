/* ################################ SETTINGS ################################ */
const settings      = require('./../../../settings');


/* ################################ GENERAL ################################# */
const jwt           = require('jsonwebtoken');
const users         = require('../../../database/userlist');



/* ################################ SIMPLE MIDDLEWARE ####################### */
const get = (req, res, next) => {
    const token = req.cookies.user;
    jwt.verify(token, settings.auth.secret, (err, decodedToken) => {
        try{
            const user = users.find(u => u.id === decodedToken.id && u.username === decodedToken.username);
            if(!user){
                res.clearCookie('user');
                return next();
            }

            req.user = { username: decodedToken.username };

        }catch{}

        next();
    })
}


module.exports = {
    get
}