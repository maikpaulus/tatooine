const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const tokenAuthentification = require('./authentification/token/jwt');
const CredentialsFactory = require('./authentification/credentials/factory');
const credentialService = CredentialsFactory.getByType('database');
const app = express();

const weatherRoutes = require('./routes/weather');
const forecastRoutes = require('./routes/forecast');
/* const lightRoutes = require('./routes/light'); */
const thermostatRoutes = require('./routes/thermostat');

let basePath = __dirname.split(path.sep);
basePath.pop();

app.use(bodyParser.json())
app.use(express.static(basePath.join(path.sep) + '/public'));

app.get('/weather/local', weatherRoutes.getLocalWeather);
app.get('/weather/forecast', forecastRoutes.getForecast);

app.get('/login', (request, response) => {
    return response.sendFile(basePath.join(path.sep) + '/public/login.html');
});

app.get('*', (request, response) => {
    let authorized = false;
    let token = request.query.token || null;

    if (!token && request.headers.authorization) {
        token = request.headers.authorization.match(/^Bearer [a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+$/) ? request.headers.authorization.split(' ')[1] : undefined;
    }
        
    if (!token) {
        return response.redirect('/login');
    }

    tokenAuthentification.checkToken(token, (result) => {
        authorized = !!result;

        if (authorized) {
            return response.sendFile(basePath.join(path.sep) + '/public/template.html');
        }

        return response.redirect('/login');
    })
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    credentialService.checkCredentials(username, password)
    .then(userinfo => {
        if (userinfo) {
            const token = tokenAuthentification.createToken(userinfo.username);
    
            return res.status(200).send({
                success: true,
                response: {
                    token,
                    username
                } 
            })
        }

        return res.status(400).send({
            success: false,
            message: 'Bei der Authentidizierung ist etwas schief gelaufen, versuche es noch einmal.' 
        }) 
    })
    .catch(err => {
        return res.status(500).send({
            success: false,
            message: 'Es gab einen unerwarteten Fehler bei der Authentifizierung.' 
        })
    });
});

app.post('/api/thermostat/:mac', thermostatRoutes.sendCommand);
/* 
app.post('/licht/an', lightRoutes.lightOn);
app.post('/licht/aus', lightRoutes.lightOff);
app.post('/licht/tor', lightRoutes.lightTor); */

app.listen(config.get('server.port'), (port) => {
    console.log('smarthome is listening on port ' + port);
});