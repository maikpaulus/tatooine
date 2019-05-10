const asyncWaterfall = require('async-waterfall');

const weatherRequest = require('../request/weather');
const forecastRequest = require('../request/forecast');

const config = require('config');

const forecast = {
    getForecast: (request, response) => {
        asyncWaterfall([
            (callback) => {
                let waterfallPackage = {};
                return callback(null, waterfallPackage);
            },

            /**
             * get current forecast weather data
             */
            forecastRequest.getForecast,

            /**
             * get relevant data of forecast
             */
            forecastRequest.formatData

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

module.exports = exports = forecast;