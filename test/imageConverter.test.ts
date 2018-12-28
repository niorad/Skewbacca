import { ImageConverter } from "../backend/ImageConverter";
import "mocha";
import { Coordinates } from "../backend/types";
import * as rimraf from "rimraf";
import * as path from "path";
import * as assert from "assert";
import * as fs from "fs";

const tempPath: string = path.join(__dirname, "/_TEMP");
const assetsPath: string = path.join(__dirname, "/assets");

describe("Image Converter", function() {
  beforeEach(function() {
    rimraf(tempPath, err => {
      if (err) console.log(err);
    });
    fs.mkdir(tempPath, err => {
      if (err) console.log(err);
    });
  });

  afterEach(function() {
    rimraf(tempPath, err => {
      if (err) console.log(err);
    });
  });

  it("generates a correct unskewing-command for ImageMagick", function() {
    const imageConverter = new ImageConverter();

    const unskewCommand = imageConverter.generateUnskewCommand(
      "sourceFile",
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
      "targetFile"
    );

    const idealCommand = `convert 'sourceFile' \\( +clone -rotate 90 +clone -mosaic +level-colors white \\) +swap -gravity Northwest -composite -distort Perspective '10,10 0,0 10,10 0,690  10,10 1000,690  10,10 1000,0' -gravity Northwest -crop 1000x690+0+0 +repage 'targetFile'`;
    assert.equal(unskewCommand, idealCommand);
  });

  it("generates a correct resizing-command for ImageMagick", function() {
    const imageConverter = new ImageConverter();
    const resizeCommand = imageConverter.generateResizeCommand(
      "test.jpg",
      10,
      "dest.jpg"
    );
    const idealCommand = `convert 'test.jpg' -resize 10% 'dest.jpg'`;
    assert.equal(resizeCommand, idealCommand);
  });

  it("Unskewing generates a new image", function(done) {
    const imageConverter: ImageConverter = new ImageConverter();
    const testSourceImage: string = path.join(assetsPath, "test.jpg");
    const testDestinationImage: string = path.join(tempPath, "test.jpg");
    const coords: Coordinates = {
      TLX: 100,
      TLY: 100,
      BLX: 450,
      BLY: 850,
      BRX: 900,
      BRY: 700,
      TRX: 800,
      TRY: 200
    };
    imageConverter
      .unskewImage(testSourceImage, coords, 1000, 1000, testDestinationImage)
      .then(() => {
        assert.equal(fs.existsSync(testDestinationImage), true);
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });
});
