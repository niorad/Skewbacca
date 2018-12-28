import { Coordinates } from "./types";
import { exec } from "child_process";

/**
 * ImageConverter is the interface to ImageMagick, and takes care of processing Images
 */
export class ImageConverter {
  /**
   * Generates an ImageMagick-Command for resizing images for previews
   * @param file The full path & name of the source-file
   * @param sizeInPercent The size of the newly created File (usually smaller)
   * @param target The full path & name of the target-file
   */
  generateResizeCommand(
    file: string,
    sizeInPercent: number,
    target: string
  ): string {
    return `convert '${file}' -resize ${sizeInPercent}% '${target}'`;
  }

  /**
   * Generates an ImageMagick-Command for unskewing an image
   * @param source The full path & name of the source-file
   * @param c An object with the coordinates of each handle
   * @param width The width of the source-image
   * @param height The height of the source-image
   * @param target The full path & name of the target-file
   */
  generateUnskewCommand(
    source: string,
    c: Coordinates,
    width: number,
    height: number,
    target: string
  ): string {
    const { TLX, TLY, BLX, BLY, BRY, BRX, TRX, TRY } = c;
    const longerSide = Math.max(width, height);
    const newHeight = (longerSide / 100) * 69;
    return `convert '${source}' \\( +clone -rotate 90 +clone -mosaic +level-colors white \\) +swap -gravity Northwest -composite -distort Perspective '${TLX},${TLY} 0,0 ${BLX},${BLY} 0,${newHeight}  ${BRX},${BRY} ${longerSide},${newHeight}  ${TRX},${TRY} ${longerSide},0' -gravity Northwest -crop ${longerSide}x${newHeight}+0+0 +repage '${target}'`;
  }

  resizeImage(
    source: string,
    sizeInPercent: number,
    target: string
  ): Promise<string> {
    return new Promise((res, rej) => {
      exec(
        this.generateResizeCommand(source, sizeInPercent, target),
        (err, stdout, stderr) => {
          if (err) {
            console.log("ResizeImage Error: ", err);
            rej(stderr);
          } else {
            console.log("ResizeImage Success!");
            res(stdout);
          }
        }
      );
    });
  }

  unskewImage(
    source: string,
    coords: Coordinates,
    width: number,
    height: number,
    target: string
  ): Promise<string> {
    return new Promise((res, rej) => {
      exec(
        this.generateUnskewCommand(source, coords, width, height, target),
        (err, stdout, stderr) => {
          if (err) {
            console.log("UnskewImage Error: ", err);
            rej(stderr);
          } else {
            console.log("UnskewImage Success!");
            res(stdout);
          }
        }
      );
    });
  }
}
