const asyncWaterfall = require('async-waterfall');
const weatherRequest = require('../request/weather');
const config = require('config');

const weather = {
    getLocalWeather: (request, response) => {
        
        asyncWaterfall([
            (callback) => {
                let waterfallPackage = {};
                return callback(null, waterfallPackage);
            },

            /**
             * get current local weather data from database
             */
            weatherRequest.getLocalWeather,

            /**
             * brings data in right format
             */
            weatherRequest.formatData,
            /**
             * add meta data for weather stations
             */
            weatherRequest.addMetaData

        ], (err, waterfallPackage) => {
            if (err) {
                throw err;
            }

            return response.status(200).json({
                httpCode: 200,
                success: true,
                response: waterfallPackage
            });
        });
    }
};

module.exports = exports = weather;