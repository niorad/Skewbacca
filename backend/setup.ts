import { app, BrowserWindow, Menu } from "electron";
import * as del from "del";
import * as fs from "fs";
import getMenuTemplate from "./menutemplate";
import { Config } from "./types";

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
  fs.mkdir(config.filePath, () => {});
  process.env.PATH += ":/usr/local/bin";
  app.on("ready", () => {
    const win = createWindow();
    setMenuForWindow(win);
  });

  app.on(
    "quit",
    (): void => {
      del([config.filePath], { force: true });
    }
  );
}
