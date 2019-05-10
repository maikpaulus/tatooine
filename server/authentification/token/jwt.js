const fs = require('fs');
const jwt = require('jsonwebtoken');
const config = require('config');

class JwtAuthentification {
    constructor(config, jwt) {
        if (!config.has('authentification') || 'jwt' !== config.get('authentification').type || !config.get('authentification').options) {
            throw new Error('Die JWT-Authentifizierung wurde nicht richtig konfiguriert.');
        }

        const authentificationOpts = config.get('authentification').options;
        if (!authentificationOpts.issuer || !authentificationOpts.privateKeyPath || !
            authentificationOpts.publicKeyPath) {
            throw new Error('Die JWT-Authentifizierung wurde nicht richtig konfiguriert.');
        }

        this.jwt = jwt;
        this.tokenAlgorithm = authentificationOpts.tokenAlgorithm || 'RS256';
        
        this.issuer = authentificationOpts.issuer;
        this.audience = authentificationOpts.audience;
        this.allowedAudiences = authentificationOpts.allowedAudiences || [];

        this.privateKeyPath = authentificationOpts.privateKeyPath;
        this.publicKeyPath = authentificationOpts.publicKeyPath;
        
        this.expirationTime = authentificationOpts.expirationTime;
    }
    /**
     * creates a new JSON Web Token
     */
    createToken(user) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const payload = {
            iat: currentTimestamp,
            exp: currentTimestamp + this.expirationTime,
            iss: this.issuer,
            aud: this.audience
        };

        const publicPayload = {
            user
        }

        const token = this.jwt.sign(Object.assign(payload, publicPayload),
            fs.readFileSync(this.privateKeyPath), { algorithm:  this.tokenAlgorithm }
        );

        return token;
    }

    /**
     * verify a given token is valid and not expired
     */
    checkToken(token, callback) {
        this.jwt.verify(token, fs.readFileSync(this.publicKeyPath), {
            issuer: this.issuer,
            audience: this.allowedAudiences
        }, (err) => {
            if (err) {
                return callback(false);
            }

            return callback(true)
        });
    }
}

module.exports = exports = new JwtAuthentification(config, jwt);