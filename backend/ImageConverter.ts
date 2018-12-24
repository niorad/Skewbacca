import { Coordinates } from "./types";

export class ImageConverter {
  generateResizeCommand(file: string, sizeInPercent: number, target: string) {
    return `convert '${file}' -resize ${sizeInPercent}% '${target}'`;
  }
  generateUnskewCommand(
    target: string,
    c: Coordinates,
    width: number,
    height: number,
    source: string
  ): string {
    const { TLX, TLY, BLX, BLY, BRY, BRX, TRX, TRY } = c;
    const longerSide = Math.max(width, height);
    const newHeight = (longerSide / 100) * 69;
    return `convert '${source}' \\( +clone -rotate 90 +clone -mosaic +level-colors white \\) +swap -gravity Northwest -composite -distort Perspective '${TLX},${TLY} 0,0 ${BLX},${BLY} 0,${newHeight}  ${BRX},${BRY} ${longerSide},${newHeight}  ${TRX},${TRY} ${longerSide},0' -gravity Northwest -crop ${longerSide}x${newHeight}+0+0 +repage '${target}'`;
  }
}
