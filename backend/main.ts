import { app, remote, BrowserWindow, dialog, ipcMain } from "electron";
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

export const getFileFromUser = (): void => {
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
};

ipcMain.on(
  "get-file-from-user",
  (): void => {
    getFileFromUser();
  }
);

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

const openFile = (file: string): void => {
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
    })
    .catch(err => {
      console.log("Error on resizing Image: ", err);
    });
};

ipcMain.on("open-file", (_data, path: string) => {
  openFile(path);
});

const convertFull = (coords: Coordinates, nw: number, nh: number): void => {
  const file = saveFileTo();
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
