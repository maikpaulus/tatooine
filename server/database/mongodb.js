const mongoClient = require('mongodb').MongoClient;

/**
 * MongoDB Wrapper for usage in repositories
 */
class MongoDB {
    constructor(opts) {
        if (!opts) {
            throw new Error('Der Datenbank-Adapter wurde nicht richtig konfiguriert.');
        }

        this.options = opts;
    }
    async connect() {
        const connection = await new Promise((resolve, reject) => {
            mongoClient.connect(this.getConnectionString(), { useNewUrlParser: true }, (err, connection) => {
                if (err) {
                    return reject(err);
                }

                return resolve(connection);
            });
        });

        return connection;
    }

    getConnectionString() {
        const options = this.options;
        return [
          'mongodb://', options.user, ':', options.password, '@', options.host, ':', options.port, '/', options.database
        ].join('');
    }

    async getCollection(collection, database = undefined) {
        const connection = await this.connect();
        const db = connection.db(database || this.options.database);
        return db.collection(collection);
    }
}

module.exports = exports = MongoDB;