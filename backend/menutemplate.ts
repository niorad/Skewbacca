import { BrowserWindow, app } from "electron";
import { getFileFromUser } from "./main";

const getMenuTemplate = (
  mainWindow: BrowserWindow
): Electron.MenuItemConstructorOptions[] => [
  {
    label: "Skewbacca",
    submenu: [
      {
        label: "About Application"
      },
      { type: "separator" },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
          app.quit();
        }
      }
    ]
  },
  {
    label: "File",
    submenu: [
      {
        label: "Open…",
        accelerator: "CmdOrCtrl+O",
        click: function() {
          getFileFromUser();
        }
      },
      {
        label: "Save As…",
        accelerator: "CmdOrCtrl+S",
        click: function() {
          mainWindow.webContents.send("save-intent", null);
        }
      }
    ]
  },
  {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        role: "undo"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "redo"
      },
      { type: "separator" },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        role: "cut"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        role: "copy"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        role: "paste"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A"
      }
    ]
  }
];

export default getMenuTemplate;
