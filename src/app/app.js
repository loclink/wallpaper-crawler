const randomString = require('random-string');
const schedule = require('node-schedule');
const config = require('./config');

const { sendEmail, send_config } = require('./send-email');
const { wallpaperCrawler } = require('./wallpaperCrawler');
const { becomingHtml, logger, readInImg } = require('../utils');

const startCrawler = async () => {
  const resolution = config.RESOLUTION || '';
  const ratios = config.RATIOS || '';
  const dirPath = config.DIR_PATH;
  const isEmailMode = config.SENDER_EMAIL && config.SENDER_PASS;
  console.log(config.RECIPIENT_EMAIL.slice(','));
  const wallpaperCount = config.WALLPAPER_COUNT ? parseInt(config.WALLPAPER_COUNT) : 24;

  let nsfw = '100';
  if (config.NSFW === 'on') {
    logger.info('绅士模式已开启');
    nsfw = '110';
  } else {
    logger.info('绅士模式已关闭');
  }
  logger.info(`本次抓取壁纸目标数为：${wallpaperCount}`);
  if (isEmailMode) {
    logger.info(`邮件模式，文件不会保存至本地`);
  } else {
    logger.info(`本地存储模式，文件将保存至本地`);
  }

  await wallpaperCrawler({
    page: 1,
    resolution,
    dirPath,
    ratios,
    nsfw,
    wallpaperCount,
    seed: randomString({ length: 6 })
  }).then(async (finalWallData) => {
    if (typeof finalWallData === 'string') return;
    if (isEmailMode) {
      const html = becomingHtml(finalWallData);
      send_config.html = `
      <div>
        <span>本次共抓取${finalWallData.length}张壁纸</span><br/>
        <hr/>
        <span>下载方式：点击预览图下方跳转链接。</span><br/>
        <span>跳转后手动另存为即可。</span><br/>
        <br/>
        <br/>
        <span>如果您对本工具比较满意，还请前往github为本工具点一个star</span>
        <a href="https://github.com/mihu915/wallpaperCrawler">前往github</a>
        <br/>
        <br/>
        ${html}
      </div>`;
      logger.info('已将壁纸数据打包为邮件格式');

      await sendEmail();
    } else {
      const saveStartTime = Math.round(new Date());
      logger.info('开始存储文件至本地...');
      await readInImg(finalWallData, dirPath).then((count) => {
        const saveEndTime = Math.round(new Date());
        logger.info(`存储结束，本次共存储${count}张壁纸，用时${(saveEndTime - saveStartTime) / 1000}s`);
      });
    }
  });
};

const scheduleCron = (cronRule) => {
  if (!cronRule) {
    logger.error('未设置定时任务规则，请在.env文件中配置规则');
    throw new Error('未设置定时任务规则，请在.env文件中配置规则');
  } else {
    logger.info('定时任务模式启动成功!');

    schedule.scheduleJob(cronRule, async () => {
      logger.info('定时任务执行中...');
      await startCrawler();
    });
  }
};

module.exports = { startCrawler, scheduleCron };
