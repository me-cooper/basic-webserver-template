module.exports = {
    server: {
        port: 3000
    },
    auth: {
        secret: 'mySuperSecretServerwideTokenHere',

        // How long should the login session be valid?
                                    // Minutes      // Hours        // Days
        valid:  (1000 * 60)         * 60              * 24            * 14 
    }
}