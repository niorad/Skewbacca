const { app, remote, BrowserWindow, dialog } = require("electron");
const { exec } = require("child_process");
const del = require("del");
const path = require("path");
const fs = require("fs");

const userDataPath = (app || remote.app).getPath("userData");
const filePath = path.join(userDataPath, "generated");
let activeSourceFile;
let activePreviewFile;
const previewSizePercent = 20;
fs.mkdir(filePath, () => {});
let mainWindow;

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
    generateConversionCommand(file, coords, nw, nh, false),
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
    generateConversionCommand(
      path.join(filePath, targetFileName),
      coords,
      nw,
      nh,
      true
    ),
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      mainWindow.webContents.send(
        "file-saved",
        path.join(filePath, targetFileName)
      );
    }
  );
});

function generateConversionCommand(
  targetFileName,
  c,
  natWidth,
  natHeight,
  isPreview
) {
  const longerSide = Math.max(natWidth, natHeight);
  const height = (longerSide / 100) * 69;

  return `convert '${
    isPreview ? activePreviewFile : activeSourceFile
  }' \\( +clone -rotate 90 +clone -mosaic +level-colors white \\) +swap -gravity Northwest -composite -distort Perspective '${
    c.TLX
  },${c.TLY} 0,0 ${c.BLX},${c.BLY} 0,${height}  ${c.BRX},${
    c.BRY
  } ${longerSide},${height}  ${c.TRX},${
    c.TRY
  } ${longerSide},0' -gravity Northwest -crop ${longerSide}x${height}+0+0 +repage '${targetFileName}'`;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 950,
    fullscreenable: false,
    titleBarStyle: "hiddenInset"
  });
  mainWindow.loadFile("index.html");
  mainWindow.setResizable(false);

  // mainWindow.webContents.openDevTools();
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
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
