const MongoDBClient = require('./../database/mongodb');
const config = require('config');
const bcrypt = require('bcryptjs');

class UserRepository {
    async getBy(username, password) {
        const connectionOpts = config.has('credentials') ? config.get('credentials').options : {};
        const client = new MongoDBClient(connectionOpts);

        let result;
        try {
            const userCollection = await client.getCollection('user'); 
            result = await new Promise((resolve, reject) => {
                userCollection.findOne({ username }, (err, doc) => {
                    if (err || !doc) {
                        return resolve(false);
                    }

                    bcrypt.compare(password, doc.password, (err, authenticated) => {
                        if (err || !authenticated) {
                            return resolve(false);
                        }


                        return resolve({ username: doc.username });
                    });
                })
            });

            return result;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
};

module.exports = exports = new UserRepository();
