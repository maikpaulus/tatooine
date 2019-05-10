
const CredentialsInterface = require('./interface');
const userRepository = require('./../../repositories/user');

class DatabaseCredentials extends CredentialsInterface {
    async checkCredentials(username, password) {
        const user = await userRepository.getBy(username, password);

        if (!user) {
            return false;
        }

        return user;
    }
}

module.exports = exports = DatabaseCredentials;