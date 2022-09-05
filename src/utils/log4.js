const log4js = require('log4js')

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    common: {
      type: 'dateFile',
      filename: 'src/logs/info',
      pattern: '.yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      // maxLogSize: 10, // 无效
      // backups: 5, // 无效
      compress: true,
      daysToKeep: 2,
      encoding: 'utf-8'
    },
    infos: {
      type: 'dateFile',
      filename: 'logs/info',
      pattern: '.yyyy-MM-dd.txt',
      compress: true,
      daysToKeep: 2
    }
    // more...
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'debug'
    },
    common: {
      // 指定为上面定义的appender，如果不指定，无法写入
      appenders: ['console', 'common'],
      level: 'all' // 指定等级
    }
    // info: {
    //   appenders: ['console', 'infos'],
    //   level: 'debug'
    // }
    // more...
  },

  // for pm2...
  pm2: true,
  disableClustering: true // not sure...
})

//err日志
const logger = log4js.getLogger('common')

module.exports = logger
