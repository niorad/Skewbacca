import { BrowserWindow, dialog } from "electron";

export class FileManager {
  getFileFromUser(focusedWindow: BrowserWindow): Promise<string> {
    return new Promise((res, rej) => {
      const files: string[] = dialog.showOpenDialog(focusedWindow, {
        properties: ["openFile"]
      });
      if (!files) {
        rej("OpenFile failed.");
      }
      res(files[0]);
    });
  }

  getSavingDestinationFromUser = (focusedWindow: BrowserWindow): string => {
    const file: string = dialog.showSaveDialog(focusedWindow, {
      title: "Save Lid",
      filters: [{ name: "JPEG", extensions: ["jpg"] }]
    });
    if (!file) return "";
    return file;
  };
}
