const config = require('config');
const http = require('http');
const moment = require('moment');

const weather = {
    getLocalWeather: (waterfallPackage, callback) => {    
        let result = '';
        let requestConfig = config.get('request.weather');

        let options = {
            hostname: requestConfig.host,
            path: requestConfig.route.local
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

                waterfallPackage.current = result.response ? result.response.current : [];

                return callback(null, waterfallPackage);
            });
        });

        req.end();
    },

    /**
     * brings data in right format 
     */
    formatData: (waterfallPackage, callback) => {
        Object.keys(waterfallPackage.current).forEach(stationId => {
            let time = waterfallPackage.current[stationId].time;
            waterfallPackage.current[stationId].time = moment(time).format('DD.MM.YYYY HH:mm');
        });

        return callback(null, waterfallPackage);
    },

    /**
     * add meta data such as label to weather stations
     */
    addMetaData: (waterfallPackage, callback) => {
        let stations = config.get('stations');

        stations.forEach(station => {
            if (waterfallPackage.current[station.id]) {
                waterfallPackage.current[station.id].label = station.label;
                waterfallPackage.current[station.id].icon = station.icon;
            }
        });

        return callback(null, waterfallPackage);
    }
};

module.exports = exports = weather;