const jimp = require('jimp');
const util = require('../../util/imageUtil');

module.exports.name = 'clip';
module.exports.description = 'Limits any image to eight colors';
module.exports.usage = 'clip <image url or attached image>';
module.exports.category = 'image';

module.exports.run = async (client, message, args, user) => {
  let img = await util.getImage(message, args, user);
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
    let oldR = img.bitmap.data[idx];
    let oldG = img.bitmap.data[idx + 1];
    let oldB = img.bitmap.data[idx + 2];
    let a = img.bitmap.data[idx + 3];
    let factor = 2;
    let newR = Math.round((factor * oldR) / 255) * (255 / factor);
    let newG = Math.round((factor * oldG) / 255) * (255 / factor);
    let newB = Math.round((factor * oldB) / 255) * (255 / factor);

    img.setPixelColor(jimp.rgbaToInt(newR, newG, newB, a), x, y);
  });
  let buffer = await util.sendImage(img, message);
  util.cacheLastImage(buffer, user);
};
