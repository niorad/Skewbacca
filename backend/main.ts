import { app, remote, BrowserWindow, dialog } from "electron";
import { exec } from "child_process";
import * as path from "path";
import { Coordinates, Config, State } from "./types";
import { initialize } from "./setup";
import ImageConverter from "./ImageConverter";

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
  exec(
    imageConverter.generateResizeCommand(
      file,
      config.previewSizePercent,
      state.activePreviewFile
    ),
    (_err, _stdout, _stderr) => {
      BrowserWindow.getFocusedWindow()!.webContents.send(
        "file-opened",
        file,
        null
      );
    }
  );
});

const convertFull = (exports.convertFull = (
  coords: Coordinates,
  nw: number,
  nh: number
): void => {
  const file = saveFileTo();
  console.log("CONVERT FULL", file);
  exec(
    imageConverter.generateUnskewCommand(
      file,
      coords,
      nw,
      nh,
      state.activeSourceFile
    ),
    (err, _, __) => {
      console.log(err);
    }
  );
});

const convertPreview = (exports.convertPreview = (
  targetFileName: string,
  coords: Coordinates,
  nw: number,
  nh: number
) => {
  exec(
    imageConverter.generateUnskewCommand(
      path.join(config.filePath, targetFileName),
      coords,
      nw,
      nh,
      state.activePreviewFile
    ),
    (_, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      BrowserWindow.getFocusedWindow()!.webContents.send(
        "file-saved",
        path.join(config.filePath, targetFileName)
      );
    }
  );
});
