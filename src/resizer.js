import sharp from "sharp";

const resizer = ({
  rotate,
  left,
  top,
  width,
  height,
  maxWidth,
  logo,
  smallLogo,
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
  if (logo) {
    const smallestborder = Math.min(height, width)
    const useSmallLogo = smallestborder < 400
    const borderWidth = useSmallLogo ? 5 : 10
    const logoComposite =   {
      input: useSmallLogo ? smallLogo : logo,
      top: Math.round((maxWidth < width ? (maxWidth / width) : 1) * height - (useSmallLogo ? 35 : 78)),
      left: useSmallLogo ? 10 : 20,
    }
    sharpInstance = sharpInstance
      .composite([
        logoComposite,
      ])
      .extend({
        top: borderWidth,
        bottom: borderWidth,
        left: borderWidth,
        right: borderWidth,
        background: { r: 0, g: 52, b: 77, alpha: 1 },
      });
  }
  return sharpInstance
    .jpeg({
      mozjpeg: true,
      quality: 80,
    })
    .on("error", (e) => console.log(e));
};
export default resizer;
