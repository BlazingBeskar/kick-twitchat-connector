import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';

export let liveStyle = {
  color: "#00FF00",
  icon: "kick"
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 1050,
    title: "Kick Chat Connector For Twitchat",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../ui/dist/index.html"));
  mainWindow.setTitle("Kick Chat Connector For Twitchat Made By BlazingBeskar");
  mainWindow.setMenuBarVisibility(false);
}



app.whenReady().then(createWindow);

ipcMain.on('save-config', (_event, config) => {
  fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(config, null, 2));
});

ipcMain.on('start-app', () => {
  import(path.join(__dirname, 'chatLogic.js'));
});

ipcMain.on("update-style", (_event, data) => {
  liveStyle = { ...liveStyle, ...data };
  console.log("🎨 Updated live style:", liveStyle);
});
