import { Coordinates } from "./types";
import { exec } from "child_process";

export class ImageConverter {
  generateResizeCommand(
    file: string,
    sizeInPercent: number,
    target: string
  ): string {
    return `convert '${file}' -resize ${sizeInPercent}% '${target}'`;
  }

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
            rej(stderr);
          } else {
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
            console.log("Conversion error:", stdout);
            rej(stderr);
          } else {
            console.log("Conversion successful:", stdout);
            res(stdout);
          }
        }
      );
    });
  }
}
