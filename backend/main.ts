import { app, remote, BrowserWindow, dialog } from "electron";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import conversionCommand from "./conversioncommand";
import { Coordinates, Config, State } from "./types";
import { initialize } from "./setup";

const state: State = {
  activeSourceFile: "",
  activePreviewFile: ""
};

const config: Config = {
  previewSizePercent: 20,
  filePath: path.join((app || remote.app).getPath("userData"), "generated")
};

fs.mkdir(config.filePath, () => {});
process.env.PATH += ":/usr/local/bin";

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
  console.log(file);
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

const openFile = (exports.openFile = file => {
  const previewFileName = "tmp_sbprev_" + path.basename(file);
  state.activeSourceFile = file;
  state.activePreviewFile = path.join(config.filePath, previewFileName);
  exec(
    `convert '${file}' -resize ${config.previewSizePercent}% '${
      state.activePreviewFile
    }'`,
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
) => {
  const file = saveFileTo();
  console.log("CONVERT FULL", file);
  exec(
    conversionCommand(file, coords, nw, nh, state.activeSourceFile),
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
    conversionCommand(
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
