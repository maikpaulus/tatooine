const request = require('request-promise');

const thermostat = {
    sendCommand(req, res) {
        const mac = req.params.mac || '';
        const command = req.body.command || undefined;
        const type = req.body.type || undefined;
        const parameters = req.body.parameters || [];

        if (!mac || !type || !command) {
            return res.status(400).json({
                success: false,
                response: {
                    message: 'Die übergebenen Daten sind nicht korrekt'
                }
            });
        }

        request.post({
            method: 'POST',
            uri: `http://smarthome:60006/${mac}/${type}/${command}`,
            body: { parameters },
            json: true
        })
        .then(response => {
            const data = response.response.data;
            return res.status(200).json({
                success: true,
                response: data
            });
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                response: {
                    message: 'Es ist ein interner Fehler aufgetreten.',
                    error: error.message
                }
            });
        });
    }
};

module.exports = exports = thermostat;