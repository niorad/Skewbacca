const { app, BrowserWindow, dialog } = require("electron");
const { exec } = require("child_process");

let mainWindow;

const getFileFromUser = (exports.getFileFromUser = () => {
  const files = dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"]
  });
  if (!files) {
    return;
  }
  const file = files[0];
  openFile(file);
  console.log(file);
});

const openFile = file => {
  const content = "a";
  mainWindow.webContents.send("file-opened", file, content);
};

const convert = (exports.convert = (
  sourceFileName,
  targetFileName,
  coords,
  nw,
  nh
) => {
  console.log(
    generateConversionCommand(sourceFileName, targetFileName, coords, nw, nh)
  );
  exec(
    generateConversionCommand(sourceFileName, targetFileName, coords, nw, nh),
    (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      mainWindow.webContents.send("file-saved", targetFileName);
    }
  );
});

function generateConversionCommand(
  sourceFileName,
  targetFileName,
  c,
  natWidth,
  natHeight
) {
  const longerSide = Math.max(natWidth, natHeight);
  const height = (longerSide / 100) * 69;

  console.log(c, { natWidth, natHeight, longerSide, height });

  return `convert ${sourceFileName} \\( +clone -rotate 90 +clone -mosaic +level-colors white \\) +swap -gravity Northwest -composite -distort Perspective '${
    c.TLX
  },${c.TLY} 0,0 ${c.BLX},${c.BLY} 0,${height}  ${c.BRX},${
    c.BRY
  } ${longerSide},${height}  ${c.TRX},${
    c.TRY
  } ${longerSide},0' -gravity Northwest -crop ${longerSide}x${height}+0+0 +repage ${targetFileName}`;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 900,
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

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
