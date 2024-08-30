import sharp from "sharp";

const resizer = ({
  rotate,
  left,
  top,
  width,
  height,
  maxWidth,
  logo,
  maxDimension,
}) => {
  console.log(rotate, left, top, width, height, maxWidth);
  let sharpInstance = sharp();
  if (rotate) sharpInstance = sharpInstance.rotate(rotate);
  sharpInstance = sharpInstance.extract({
    left,
    top,
    width,
    height,
  });
  // only works if noLogo is selected
  if (maxDimension) {
    const largerDimensionProp = width > height ? "width" : "height";
    const largerDimension = largerDimensionProp === "width" ? width : height;
    if (maxDimension < largerDimension)
      sharpInstance = sharpInstance.resize({
        [largerDimensionProp]: maxDimension,
      });
  } else {
    if (maxWidth < width)
      sharpInstance = sharpInstance.resize({ width: maxWidth });
  }
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
