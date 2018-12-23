import { app, BrowserWindow, Menu } from "electron";
import * as del from "del";
import getMenuTemplate from "./menutemplate";
import { Coordinates, Config, State } from "./types";

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 890,
    fullscreenable: false,
    titleBarStyle: "hiddenInset"
  });
  mainWindow.loadFile("frontend/index.html");
  mainWindow.setResizable(false);
  mainWindow.webContents.openDevTools();
  return mainWindow;
}

function setMenuForWindow(window: BrowserWindow): void {
  Menu.setApplicationMenu(Menu.buildFromTemplate(getMenuTemplate(window)));
}

export function initialize(config: Config): void {
  app.on("ready", () => {
    const win = createWindow();
    setMenuForWindow(win);
  });

  app.on("window-all-closed", function() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("quit", function() {
    del([config.filePath], { force: true });
  });
}
