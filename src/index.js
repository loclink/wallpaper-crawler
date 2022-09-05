const { scheduleCron } = require('./app/app')
const config = require('./app/config')

scheduleCron(config.RECURRENCE_RULE)
