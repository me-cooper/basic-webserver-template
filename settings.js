module.exports = {
    server: {
        port: 3000
    },
    auth: {
        
        secret: 'mySuperSecretServerwideTokenHere',

        // How long should the login session be valid?
        // 2 minutes, 5 hours, 12 days, .... || or  type a simple "1000" for 1000ms validity
        valid:  '10 minutes'
        
    }
}