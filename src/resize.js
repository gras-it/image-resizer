const sharp = require('sharp')

module.exports = ({
  rotate, left, top, width, height, maxWidth
}) => sharp()
    .rotate(rotate)
    .extract({
      left,
      top,
      width,
      height,
    })
    .resize({ width: maxWidth })
    .jpeg({
      mozjpeg: true,
      quality: 80
    })
  