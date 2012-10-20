###
# Normal configuration values
###
configuration =
  app_port: process.env.PORT or 3000
  mongo_name: 'nodelings'
  mongo_port: 27017
  mongo_host: 'localhost'
  mongo_sandbox: process.env.SANDBOX or false
  ssl_private_key: 'ssl/nodelings.key'
  ssl_certificate: 'ssl/nodelings.crt'

exports.config = configuration