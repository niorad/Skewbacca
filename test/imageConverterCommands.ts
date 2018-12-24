import { ImageConverter } from "../backend/ImageConverter";
import "mocha";
import * as assert from "assert";

describe("Image Converter", function() {
  it("Generates a correct image-conversion-command for ImageMagick", function() {
    const imageConverter = new ImageConverter();

    const unskewCommand = imageConverter.generateUnskewCommand(
      "targetFile",
      {
        TLX: 10,
        TLY: 10,
        BLX: 10,
        BLY: 10,
        BRY: 10,
        BRX: 10,
        TRX: 10,
        TRY: 10
      },
      10,
      1000,
      "sourceFile"
    );

    const idealCommand = `convert 'sourceFile' \\( +clone -rotate 90 +clone -mosaic +level-colors white \\) +swap -gravity Northwest -composite -distort Perspective '10,10 0,0 10,10 0,690  10,10 1000,690  10,10 1000,0' -gravity Northwest -crop 1000x690+0+0 +repage 'targetFile'`;
    assert.equal(unskewCommand, idealCommand);
  });
});
