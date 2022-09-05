const { startCrawler } = require('./app')
const { logger } = require('../utils')
logger.info('已启动直接运行模式...')

startCrawler()
