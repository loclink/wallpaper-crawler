const { wallhaven } = require('./wallhaven');
const { logger } = require('../utils');

const wallpaperCrawler = (option) => {
  return new Promise(async (resolve, reject) => {
    logger.info('开始抓取壁纸...');
    let wallData = [];
    // 记录开始时间
    const crawlerStartTime = Math.round(new Date());

    // 开始抓取wallhaven站点壁纸
    const finalWallData = await wallhaven(option, wallData);

    if (typeof finalWallData === 'string') {
      logger.info(finalWallData);
      return resolve(finalWallData);
    }

    // 记录结束时间
    const crawlerEndTime = Math.round(new Date());

    logger.info(`共解析${finalWallData.length}张壁纸数据，用时${(crawlerEndTime - crawlerStartTime) / 1000}s`);
    resolve(finalWallData);
  });
};

module.exports = {
  wallpaperCrawler
};
