/**
 * Normal configuration values
 */

var configuration = {
    app_port: process.env.PORT || 3000,
    mongo_name: 'nodelings',
    mongo_port: 27017,
    mongo_host: 'localhost',
}

exports.config = configuration;

