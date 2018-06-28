const userEventProcessor = require('./userEventProcessor');
const config = require('../../conf');
const logger = require('../utils/logger');

const connection = require('amqplib').connect({
    protocol: 'amqp',
    hostname: config.rabbitmq.host,
    username: config.rabbitmq.userName,
    password: config.rabbitmq.password,
});

exports.initializeEventsConsumers = function() {
    return connection.then(function(conn) {
        /** *
         * get the number of registered events,
         * create a channel for each event and register a consumer for each consumer
         */
        Object.keys(registeredEvents).map((event, index) => {
            logger.info('event', event);
            return conn.createChannel().then((channel) => {
                let queue = registeredEvents[event].queueName;
                logger.info('queueName', queue);
                return channel.assertQueue(queue).then((ok) =>{
                    logger.info('receiving from queue....', ok);
                    return channel.consume(queue, function(msg) {
                        if (msg && msg.content) {
                            logger.info('msg received in queue ', queue);
                            let data = Buffer.from(msg.content).toString();
                            try {
                                data = JSON.parse(data);
                                registeredEvents[event].handler(data);
                            } catch (e) {
                                logger.info('not able to parse data into JSON Object, skipping data');
                            }
                        } 
                           // send acknowledgemwnt
                            channel.ack(msg);
                    });
                });
            });
        });
    }).catch(console.warn);
};

registeredEvents = {
    // mapping for event_type and handler for it.
    'user_created': {
        queueName: 'integrations.contact.created',
        handler: userEventProcessor.processUserCreatedEvent,
    },
    'user_updated': {
        queueName: 'integrations.contact.updated',
        handler: userEventProcessor.processUserUpdatedEvent,
    },
};

//this.initializeEventsConsumers();