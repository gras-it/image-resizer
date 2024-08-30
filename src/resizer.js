import sharp from "sharp";

const resizer = ({ rotate, left, top, width, height, maxWidth, logo }) => {
  console.log(rotate, left, top, width, height, maxWidth);
  let sharpInstance = sharp();
  if (rotate) sharpInstance = sharpInstance.rotate(rotate);
  sharpInstance = sharpInstance.extract({
    left,
    top,
    width,
    height,
  });
  if (maxWidth < width)
    sharpInstance = sharpInstance.resize({ width: maxWidth });
  if (logo)
    sharpInstance = sharpInstance
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
      });
  return sharpInstance
    .jpeg({
      mozjpeg: true,
      quality: 80,
    })
    .on("error", (e) => console.log(e));
};
export default resizer;
