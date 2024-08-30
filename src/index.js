import express from "express";
import cors from "cors";
import sharp from "sharp";
import Busboy from "busboy";
import resizer from "./resizer.js";
const app = express();

const port = process.env.PORT || 3010;
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
    const busboy = Busboy({ headers: req.headers });
    const { rotate, left, top, width, height, maxWidth, noLogo = false } = req.query;
    res.set("Content-Type", "image/jpeg"); // Change to the appropriate MIME type
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
              logo: noLogo ? undefined : logo,
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
