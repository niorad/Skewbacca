const { app, remote, BrowserWindow, dialog, Menu } = require("electron");
const { exec } = require("child_process");
const del = require("del");
const path = require("path");
const fs = require("fs");
const { conversionCommand } = require("./conversioncommand");
const { menuTemplate } = require("./menutemplate");

const userDataPath = (app || remote.app).getPath("userData");
const filePath = path.join(userDataPath, "generated");
let activeSourceFile;
let activePreviewFile;
const previewSizePercent = 20;
fs.mkdir(filePath, () => {});
let mainWindow;

process.env.PATH += ":/usr/local/bin";

const getFileFromUser = (exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"]
  });
  if (!files) {
    return;
  }
  const file = files[0];
  activeSourceFile = file;
  openFile(file);
  console.log(file);
});

const saveFileTo = () => {
  const file = dialog.showSaveDialog(mainWindow, {
    title: "Save Lid",
    filters: [{ name: "JPEG", extensions: ["JPG"] }]
  });
  if (!file) return;
  return file;
};

const openFile = (exports.openFile = file => {
  console.log("OPEN FILE REMOTE: ", file);
  const originalFileName = path.basename(file);
  const previewFileName = "tmp_sbprev_" + originalFileName;
  activeSourceFile = file;
  activePreviewFile = path.join(filePath, previewFileName);
  exec(
    `convert '${file}' -resize ${previewSizePercent}% '${activePreviewFile}'`,
    (err, stdout, stderr) => {
      mainWindow.webContents.send("file-opened", file, null);
    }
  );
});

const convertFull = (exports.convertFull = (coords, nw, nh) => {
  const file = saveFileTo();
  console.log("CONVERT FULL", file);
  exec(
    conversionCommand(file, coords, nw, nh, activeSourceFile),
    (err, stdout, stderr) => {
      mainWindow.webContents.send("log", { err, stdout, stderr });
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
      path.join(filePath, targetFileName),
      coords,
      nw,
      nh,
      activePreviewFile
    ),
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      mainWindow.webContents.send("log", { err, stdout, stderr });
      mainWindow.webContents.send(
        "file-saved",
        path.join(filePath, targetFileName)
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
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  mainWindow.loadFile("frontend/index.html");
  mainWindow.setResizable(false);
  mainWindow.setVibrancy("ultra-dark");
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
  del([filePath], { force: true });
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
