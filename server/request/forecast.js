const config = require('config');
const http = require('http');
const moment = require('moment');

const forecast = {
    getForecast: (waterfallPackage, callback) => {    
        let result = '';
        let requestConfig = config.get('request.forecast');

        let options = {
            hostname: requestConfig.host,
            path: requestConfig.route.forecast
        };

        if (requestConfig.port) {
            options.port = requestConfig.port;
        }

        const req = http.request(options, (res) => {
            res.on('data', (chunk) => {
                result += chunk;
            });

            res.on('end', () => {
                try {
                    result = JSON.parse(result);
                }
                catch (err) {
                    return callback(err);
                }

                waterfallPackage.forecast = result.list;
                waterfallPackage.city = result.city;

                return callback(null, waterfallPackage);
            });
        });

        req.end();
    },

    formatData: (waterfallPackage, callback) => {
        waterfallPackage.forecast = waterfallPackage.forecast.slice(0, 20);
        let min = 1000;
        let max = -1000;
        
        waterfallPackage.forecast.forEach((forecast) => {
            if (forecast.main.temp < min) {
                min = forecast.main.temp;
            }

            if (forecast.main.temp > max) {
                max = forecast.main.temp;
            }
        });

        /* reduce object to needed data */
        waterfallPackage.forecast = waterfallPackage.forecast.map((forecast) => {
            return {
                time: moment.unix(forecast.dt).format('DD.MM.YYYY HH:mm'),
                temperature: Math.round(forecast.main.temp),
                temp_min: Math.round(forecast.main.temp_min), 
                temp_max: Math.round(forecast.main.temp_max) 
            }
        });

        waterfallPackage.range = {
            min: Math.round(min), 
            max: Math.round(max)
        }

        return callback(null, waterfallPackage)
    } 
};

module.exports = exports = forecast;