const amqp = require('amqp');
const config = require('config');

const connectionParams = config.has('rabbitmq') ? config.get('rabbitmq') : undefined;

if (!connectionParams) {
    console.log('Die Konfiguration für RabbitMQ wurde nicht gefunden. Bitte konfigurieren.');
    process.exit(0);
}

const connection = amqp.createConnection({ 
    host: connectionParams.host,
    port: connectionParams.port,
    login: connectionParams.user,
    password: connectionParams.password,
    vhost: connectionParams.vhost
});

connection.on('error', function(err) { 
    console.error('Connection error', err); 
});

let exchg;

connection.on('ready', () => {
    connection.exchange('milight', {
        confirm: true,
        durable: true,
        autoDelete: false
    }, (exchange) => {
        exchg = exchange;
        let queue = connection.queue('milight', {
           durable: true,
           autoDelete: false
        });
        queue.bind(exchg, 'milight');
    });
});

const light = {
    lightOn(req, res) {
        connection.publish('milight', JSON.stringify({
            command: 'licht.an',
            props: {
                zone: 0
            }
        }));

        res.send('licht an');
    },

    lightOff(req, res) {
        connection.publish('milight', JSON.stringify({
            command: 'licht.aus',
            props: {
                zone: 0
            }
        }));

        res.send('licht aus');
    },

    lightTor(req, res) {
        connection.publish('milight', JSON.stringify({
            command: 'toralarm',
            props: {
                zone: 0
            }
        }));

        res.send('tor');
    }
};

module.exports = exports = light;