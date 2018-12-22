const { app, remote, BrowserWindow, dialog, Menu } = require("electron");
const { exec } = require("child_process");
const del = require("del");
const path = require("path");
const fs = require("fs");
const { conversionCommand } = require("./conversioncommand");
const { getMenuTemplate } = require("./menutemplate");

let mainWindow;

const state = {
  activeSourceFile: "",
  activePreviewFile: "",
  config: {
    previewSizePercent: 20,
    filePath: path.join((app || remote.app).getPath("userData"), "generated")
  }
};

fs.mkdir(state.config.filePath, () => {});
process.env.PATH += ":/usr/local/bin";

const getFileFromUser = (exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"]
  });
  if (!files) {
    return;
  }
  const file = files[0];
  state.activeSourceFile = file;
  openFile(file);
  console.log(file);
});

const saveFileTo = () => {
  const file = dialog.showSaveDialog(mainWindow, {
    title: "Save Lid",
    filters: [{ name: "JPEG", extensions: ["jpg"] }]
  });
  if (!file) return;
  return file;
};

const openFile = (exports.openFile = file => {
  const previewFileName = "tmp_sbprev_" + path.basename(file);
  state.activeSourceFile = file;
  state.activePreviewFile = path.join(state.config.filePath, previewFileName);
  exec(
    `convert '${file}' -resize ${state.config.previewSizePercent}% '${
      state.activePreviewFile
    }'`,
    (_err, _stdout, _stderr) => {
      mainWindow.webContents.send("file-opened", file, null);
    }
  );
});

const convertFull = (exports.convertFull = (coords, nw, nh) => {
  const file = saveFileTo();
  console.log("CONVERT FULL", file);
  exec(
    conversionCommand(file, coords, nw, nh, state.activeSourceFile),
    (err, stdout, stderr) => {
      console.log(err);
    }
  );
});

const convertPreview = (exports.convertPreview = (
  targetFileName,
  coords,
  nw,
  nh
) => {
  exec(
    conversionCommand(
      path.join(state.config.filePath, targetFileName),
      coords,
      nw,
      nh,
      state.activePreviewFile
    ),
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      mainWindow.webContents.send(
        "file-saved",
        path.join(state.config.filePath, targetFileName)
      );
    }
  );
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 890,
    fullscreenable: false,
    titleBarStyle: "hiddenInset"
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate(mainWindow)));
  mainWindow.loadFile("frontend/index.html");
  mainWindow.setResizable(false);
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("quit", function() {
  del([state.config.filePath], { force: true });
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
