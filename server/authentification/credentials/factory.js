const SuccessfulCredentials = require('./successful');
const DatabaseCredentials = require('./database');

class CredentialsFactory {
    static getByType(type) {
        switch (type) {
            case 'successful':
                return new SuccessfulCredentials();

            case 'database':
                return new DatabaseCredentials();

            default:
                throw new Error(`Es wurde kein CredentialsService des Typ ${type} gefunden`)
        }
    }    
}

module.exports = exports = CredentialsFactory