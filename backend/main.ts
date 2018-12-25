import { app, remote, BrowserWindow, dialog } from "electron";
import { exec } from "child_process";
import * as path from "path";
import { Coordinates, Config, State } from "./types";
import { initialize } from "./setup";
import { ImageConverter } from "./ImageConverter";

const state: State = {
  activeSourceFile: "",
  activePreviewFile: ""
};

const config: Config = {
  previewSizePercent: 20,
  filePath: path.join((app || remote.app).getPath("userData"), "generated")
};

const imageConverter = new ImageConverter();

initialize(config);

const getFileFromUser = (exports.getFileFromUser = (): void => {
  const files: string[] = dialog.showOpenDialog(
    BrowserWindow.getFocusedWindow()!,
    {
      properties: ["openFile"]
    }
  );
  if (!files) {
    return;
  }
  const file: string = files[0];
  state.activeSourceFile = file;
  openFile(file);
});

const saveFileTo = (): string => {
  const file: string = dialog.showSaveDialog(
    BrowserWindow.getFocusedWindow()!,
    {
      title: "Save Lid",
      filters: [{ name: "JPEG", extensions: ["jpg"] }]
    }
  );
  if (!file) return "";
  return file;
};

const openFile = (exports.openFile = (file: string): void => {
  const previewFileName = "tmp_sbprev_" + path.basename(file);
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
    });
});

const convertFull = (exports.convertFull = (
  coords: Coordinates,
  nw: number,
  nh: number
): void => {
  const file = saveFileTo();
  console.log("CONVERT FULL", file);
  imageConverter
    .unskewImage(file, coords, nw, nh, state.activeSourceFile)
    .then(() => {
      console.log("Conversion Done!");
    });
});

const convertPreview = (exports.convertPreview = (
  targetFileName: string,
  coords: Coordinates,
  nw: number,
  nh: number
): void => {
  const fullSourceFilePath = path.join(config.filePath, targetFileName);
  imageConverter
    .unskewImage(fullSourceFilePath, coords, nw, nh, state.activePreviewFile)
    .then(() => {
      BrowserWindow.getFocusedWindow()!.webContents.send(
        "file-saved",
        fullSourceFilePath
      );
    });
});
