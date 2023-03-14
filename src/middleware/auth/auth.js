/* ################################ SETTINGS ################################ */
const settings      = require('../../../settings');


/* ################################ GENERAL ################################# */
const jwt           = require('jsonwebtoken');
const users         = require('../../../database/userlist');



/* ################################ SIMPLE MIDDLEWARE ####################### */
const isValid = (req, res, next) => {
    const token = req.cookies.user;
    if (!token) {
        return redirectToLogin(req, res);
    }
    jwt.verify(token, settings.auth.secret, (err, decodedToken) => {
        try{
            const user = users.find(u => u.id === decodedToken.id && u.username === decodedToken.username);
            if(!user) return redirectToLogin(req, res);
            return next();
        }catch{
            return redirectToLogin(req, res);  
        }
    })
}


const redirectToLogin = (req, res) => {
    res.clearCookie('user');
    res.cookie('returnTo', req.originalUrl);
    return res.status(403).redirect('/login');
}

module.exports = {
    isValid
}