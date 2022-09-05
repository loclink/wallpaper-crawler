const fs = require('fs')
const path = require('path')

//   {
//     filename: '附件',
//     path: './app/app.js'
//   }
const emailAttachmentMap = (dirPath) => {
  const files = fs.readdirSync(
    path.resolve(path.join(__dirname, '..'), dirPath)
  )

  const emailAttachmentObject = files.map((item, index, array) => {
    return {
      filename: item,
      path: path.resolve(path.join(__dirname, '..'), `./${dirPath}/${item}`)
    }
  })

  return emailAttachmentObject
}

const becomingHtml = wallData => {
  let html = ''
  wallData.forEach(item => {
    html =
      html +
      `
    <div style="margin:20px 0; text-align="center">
      <img src=${item.previewUrl} alt=${item.name} />
      <a href=${item.downloadUrl}>
        下载地址：${item.name}
      </a>
    </div>
    <hr/>
    `
  })
  return html
}

module.exports = {
  emailAttachmentMap,
  becomingHtml
}
