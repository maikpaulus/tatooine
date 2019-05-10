
const CredentialsInterface = require('./interface');

class SuccessfulCredentials extends CredentialsInterface {
    async checkCredentials(username, password) {
        return true;
    }
}

module.exports = exports = SuccessfulCredentials;