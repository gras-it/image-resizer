const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3010
const Busboy = require('busboy');
const resizer = require('./resize')
const corsOptions = {
  origin: ['https://admin.graslawn.com', 'https://aspire-front-end.ngrok.io'],
  methods: ['GET', 'POST', 'OPTIONS'],
}
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
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename);

    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
    file.pipe(resizer({
      rotate: Number(rotate),
      left: Number(left),
      top: Number(top),
      width: Number(width),
      height: Number(height),
      maxWidth: Number(maxWidth),
    })).pipe(res)
  });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    // console.log('Field [' + fieldname + ']: value: ' + inspect(val));
  });
  busboy.on('finish', function() {
    // console.log('Done parsing form!');
    // res.writeHead(303, { Connection: 'close', Location: '/' });
    // res.end();
  });
  req.pipe(busboy);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})