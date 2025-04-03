import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ensureDefaultConfig, saveConfig } from './configStore'; 
import fs from 'fs';

const logPath = path.join(app.getPath('userData'), 'log.txt');
const logStream = fs.createWriteStream(logPath, { flags: 'a' });
console.log = (...args) => logStream.write('[LOG] ' + args.join(' ') + '\n');
console.error = (...args) => logStream.write('[ERROR] ' + args.join(' ') + '\n');

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

  mainWindow.loadFile(path.join(__dirname, '..', 'ui', 'dist', 'index.html'));
  mainWindow.setTitle("Kick Chat Connector For Twitchat Made By BlazingBeskar");
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('save-config', (_event, config) => {
  console.log("💾 Saving config...");
  saveConfig(config);
});

ipcMain.on('start-app', () => {
  // ✅ Set Puppeteer's Chromium path before loading chatLogic
  const chromiumPath = path.join(
    process.resourcesPath,
    'app',
    '@puppeteer',
    '.local-chromium',
    'win64-1345491',
    'chrome-win64',
    'chrome.exe'
  );

  process.env.PUPPETEER_EXECUTABLE_PATH = chromiumPath;
  console.log("✅ Using bundled Chromium:", chromiumPath);

  const chatLogicPath = path.join(__dirname, 'chatLogic.js');
  console.log("📦 Loading chat logic from:", chatLogicPath);

  import(chatLogicPath).catch((err) => {
    console.error("❌ Failed to load chatLogic.js:", err);
  });
});

ipcMain.handle('load-config', () => {
  const config = ensureDefaultConfig();
  return config;
});

ipcMain.on("update-style", (_event, data) => {
  liveStyle = { ...liveStyle, ...data };
  console.log("🎨 Updated live style:", liveStyle);
});
