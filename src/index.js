const express = require("express");
var cors = require("cors");
const app = express();
const sharp = require("sharp");

const port = process.env.PORT || 3010;
const Busboy = require("busboy");
const envOrigins = process.env.ORIGINS;
const regExEnvOrigins = process.env.REGEX_ORIGINS;
const corsOptions = {
  origin: [
    ...(envOrigins ? envOrigins.split(",") : []),
    ...(regExEnvOrigins
      ? regExEnvOrigins.split(",").map((str) => new RegExp(str))
      : []),
  ],
  methods: ["GET", "POST", "OPTIONS"],
};
const resizer = ({ rotate, left, top, width, height, maxWidth, logo }) => {
  console.log(rotate, left, top, width, height, maxWidth);
  return sharp()
    .rotate(rotate)
    .extract({
      left,
      top,
      width,
      height,
    })
    .resize({ width: maxWidth })
    .composite([
      {
        input: logo,
        top: Math.round((maxWidth / width) * height - 78),
        left: 20,
      },
    ])
    .extend({
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
      background: { r: 0, g: 52, b: 77, alpha: 1 },
    })
    .jpeg({
      mozjpeg: true,
      quality: 80,
    })
    .on("error", (e) => console.log(e));
};

(async () => {
  const logo = await sharp("logo.png")
    .resize({
      width: 100,
    })
    .toBuffer();
  app.get("/", cors(corsOptions), (req, res) => {
    res.send("I am up!");
  });
  app.post("/", cors(corsOptions), (req, res) => {
    const busboy = new Busboy({ headers: req.headers });
    const { rotate, left, top, width, height, maxWidth } = req.query;
    busboy.on("file", (_, file) => {
      try {
        file.on("data", () => null);
        file
          .pipe(
            resizer({
              rotate: Number(rotate),
              left: Number(left),
              top: Number(top),
              width: Number(width),
              height: Number(height),
              maxWidth: Number(maxWidth),
              logo,
            })
          )
          .pipe(res);
      } catch (error) {
        console.log("catch caught", error);
        res.sendStatus(500);
      }
    });
    busboy.on("field", () => null);
    busboy.on("finish", () => null);
    req.pipe(busboy);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
