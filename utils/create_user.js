/* ################################ CYRPT ################################ */
const bcrypt            = require('bcryptjs');
const salt              = bcrypt.genSaltSync(10);

/* ################################ PROMPT ############################### */
const prompt = require('prompt');

/* ################################ USER ################################# */
const users             = require('./../database/userlist');



/* ################################ PROMPT ############################### */
var schema = {
    properties: {
        Username: {
            required: true
        },
        Password: {
            hidden: true
        }
    }
};

prompt.start();
prompt.get(schema, function (err, result) {
    if (err) { return onErr(err); }

    var username = result.Username;
    var password = result.Password;


    const user = users.find(u => (u.username).toLowerCase() === username.toLowerCase());
    if(user){
        console.log(`Username > ${username} < is already registered in './database/userlist.js'`);
        return;
    }


    bcrypt.hash(password, salt, (err, res) => {

        var user = {
            id: users.length + 1,
            username: username,
            password: res
        }
        
        console.log(`Please add new user > ${username} < manually to './database/userlist.js'`);
        console.log(user);

    });
    
});

function onErr(err) {
    console.log(err);
    return 1;
}