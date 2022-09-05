const fs = require('fs')
const request = require('request')

// 异步执行函数，用于下载图片，接收参数：图片地址，文件名，文件后缀
function downloadImg(filePath, img_url, file_name, callback) {
  const writeStream = fs.createWriteStream(`./src/${filePath}/` + file_name)

  // 调request下的pipe方法，配合文档写入流，存储图片
  const readStream = request(img_url, { timeout: 600000 })

  readStream.pipe(writeStream)

  writeStream.on('error', err => {
    console.log('writeStream', err)
  })

  writeStream.on('finish', () => {
    callback && callback(null, file_name)
  })
}

module.exports = {
  downloadImg
}
