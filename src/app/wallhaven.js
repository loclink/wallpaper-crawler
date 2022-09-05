const randomString = require('random-string');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const { dirExists } = require('../utils');

const wallhaven = async (option, wallData) => {
  return new Promise(async (resolve, reject) => {
    const { seed, dirPath, resolution, page, ratios, nsfw, wallpaperCount } = option;
    const savePath = path.resolve(path.join(__dirname, '..'), dirPath);
    let url = `https://wallhaven.cc/search?categories=111&purity=${nsfw}&sorting=random&order=desc&ratios=${ratios}&resolutions=${resolution}&seed=${seed}&page=${page}`;
    let $ = '';
    let pageData = [];
    // 则自动创建存储文件夹
    await dirExists(savePath);

    // 抓取相关标签对象
    const elementData = await axios({
      method: 'get',
      url
    })
      .then((res) => {
        $ = cheerio.load(res.data);
        const wallPreviewUrl = $('ul>li>figure').find('img');

        if (!wallPreviewUrl.length) {
          return '未查询到相关壁纸，请检查配置文件.env中的比例与分辨率是否冲突。';
        }

        const thumbInfo = $('ul>li>figure').find('.thumb-info');
        return {
          wallPreviewUrl,
          thumbInfo
        };
      })
      .catch((err) => {
        resolve('当前网络环境不佳导致请求失败');
        return;
      });

    // 判断是否为报错信息，若是报错，则return
    if (typeof elementData === 'string') {
      resolve(elementData);
      return;
    }

    const { wallPreviewUrl, thumbInfo } = elementData;

    // 获取所有预览图链接，生成资源数据对象, 拿到每张图片的名称
    wallPreviewUrl.each((i, item) => {
      const url = $(item).attr('data-src');
      pageData.push({
        name: url.split('/')[5].split('.')[0],
        previewUrl: url
      });
    });

    // 解析每张图的后缀，给每个图片名称加上后缀，存入资源数据对象，
    thumbInfo.each((i, item) => {
      let postfix = '';
      if ($(item).find('.png').text()) {
        postfix = 'png';
      } else {
        postfix = 'jpg';
      }
      pageData[i].postfix = postfix;
      pageData[i].name += '.' + postfix;
    });

    // 开始拼接所有实际图片的跳转链接,将链接存入资源对象,并开始写入数据
    pageData.forEach(async (item) => {
      const prefix = item.previewUrl.split('/')[4];
      const downloadUrl = `https://w.wallhaven.cc/full/${prefix}/wallhaven-${item.name}`;
      item.downloadUrl = downloadUrl;
    });

    wallData.push(...pageData);

    if (wallData.length >= wallpaperCount) {
      wallData = wallData.filter((item, index, array) => {
        if (index + 1 <= wallpaperCount) {
          return true;
        }
      });
      resolve(wallData);
    } else {
      option.seed = randomString({ length: 6 });
      wallData = await wallhaven(option, wallData);
      resolve(wallData);
    }
  });
};

module.exports = {
  wallhaven
};
