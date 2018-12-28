import { app, remote, BrowserWindow, dialog, ipcMain } from "electron";
import * as path from "path";
import { Coordinates, Config, State } from "../types/types";
import { initialize } from "./setup";
import { ImageConverter } from "./ImageConverter";
import { FileManager } from "./FileManager";

const state: State = {
  activeSourceFile: "",
  activePreviewFile: ""
};

const config: Config = {
  previewSizePercent: 20,
  filePath: path.join((app || remote.app).getPath("userData"), "generated"),
  previewFilePrefix: "tmp_sbprev_"
};

const imageConverter = new ImageConverter();
const fileManager = new FileManager();

initialize(config);

export const onOpenFileRequested = (): void => {
  const currentBrowserWindow = BrowserWindow.getFocusedWindow()!;
  fileManager.getFileFromUser(currentBrowserWindow).then(file => {
    state.activeSourceFile = file;
    openFile(file);
  });
};

const openFile = (file: string): void => {
  const previewFileName = config.previewFilePrefix + path.basename(file);
  state.activeSourceFile = file;
  state.activePreviewFile = path.join(config.filePath, previewFileName);
  imageConverter
    .resizeImage(file, config.previewSizePercent, state.activePreviewFile)
    .then(() => {
      BrowserWindow.getFocusedWindow()!.webContents.send(
        "file-opened",
        file,
        null
      );
    })
    .catch(err => {
      console.log("Error on resizing Image: ", err);
    });
};

ipcMain.on("open-file", (_data, path: string) => {
  openFile(path);
});

const convertFull = (coords: Coordinates, nw: number, nh: number): void => {
  const file = fileManager.getSavingDestinationFromUser(
    BrowserWindow.getFocusedWindow()!
  );
  console.log("CONVERT FULL", file);
  imageConverter
    .unskewImage(state.activeSourceFile, coords, nw, nh, file)
    .then(() => {
      console.log("Conversion Done!");
    })
    .catch(err => {
      console.log("Cenvert Full Error:", err);
    });
};

ipcMain.on(
  "convert-full",
  (_data, coords: Coordinates, nw: number, nh: number) => {
    convertFull(coords, nw, nh);
  }
);

const convertPreview = (
  targetFileName: string,
  coords: Coordinates,
  nw: number,
  nh: number
): void => {
  const fullTargetFilePath = path.join(config.filePath, targetFileName);
  imageConverter
    .unskewImage(state.activePreviewFile, coords, nw, nh, fullTargetFilePath)
    .then(() => {
      BrowserWindow.getFocusedWindow()!.webContents.send(
        "file-saved",
        fullTargetFilePath
      );
    })
    .catch(err => {
      console.log("Convert Preview Error:", err);
    });
};

ipcMain.on(
  "convert-preview",
  (_data, path: string, coords: Coordinates, nw: number, nh: number) => {
    convertPreview(path, coords, nw, nh);
  }
);
