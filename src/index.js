const express = require('express')
var cors = require('cors')
const app = express()
const sharp = require('sharp')

const port = process.env.PORT || 3010
const Busboy = require('busboy');
const resize = require('./resize')
// const resizer = require('./resize')
const corsOptions = {
  origin: ['https://admin.graslawn.com', 'https://aspire-front-end.ngrok.io'],
  methods: ['GET', 'POST', 'OPTIONS'],
}
const resizer = ({
  rotate,
  left,
  top,
  width,
  height,
  maxWidth,
  logo
}) => {
  return sharp()
    .rotate(rotate)
    .extract({
      left,
      top,
      width,
      height,
    })
    .resize({ width: maxWidth })
    .composite([{
      input: logo,
      top: ((maxWidth / width) * height) - 38,
      left: 17
    }])
    .extend({
      top: 7,
      bottom: 7,
      left: 7,
      right: 7,
      background: { r: 0, g: 52, b: 77, alpha: 1 }
    })
    .jpeg({
      mozjpeg: true,
      quality: 80
    })
    .on('error', e => console.log(e))
}


;(async () => {
  const logo = await sharp('logo.png').resize({
    width: 50,
  }).toBuffer()
  app.get('/', cors(corsOptions), (req, res) => {
    res.send('I am up!')
  })
  app.post('/', cors(corsOptions), (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    const {
      rotate,
      left,
      top,
      width,
      height,
      maxWidth
    } = req.query
    busboy.on('file', file => {
      file.on('data', () => null)
      file.pipe(resizer({
        rotate: Number(rotate),
        left: Number(left),
        top: Number(top),
        width: Number(width),
        height: Number(height),
        maxWidth: Number(maxWidth),
        logo
      })).pipe(res)
    });
    busboy.on('field', () => null);
    busboy.on('finish', () => null));
    req.pipe(busboy);
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})()
