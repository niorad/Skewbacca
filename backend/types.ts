export interface Coordinates {
  TLX: number;
  TLY: number;
  BLX: number;
  BLY: number;
  BRY: number;
  BRX: number;
  TRX: number;
  TRY: number;
}

export interface Config {
  previewSizePercent: number;
  filePath: string;
}

export interface State {
  activeSourceFile: string;
  activePreviewFile: string;
}
