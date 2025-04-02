import fs from 'fs';
import path from 'path';
import OBSWebSocket from 'obs-websocket-js';
import { createClient } from '@retconned/kick-js';
import { BrowserWindow } from 'electron';
import { liveStyle } from './main';

function sendToRenderer(channel: string, data: any) {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    win.webContents.send(channel, data);
  }
}

const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));

const obs = new OBSWebSocket();
const client = createClient(CONFIG.KICK.CHANNEL, {
  logger: CONFIG.KICK.LOGGER,
  readOnly: CONFIG.KICK.READ_ONLY,
});

async function connectToOBS(): Promise<boolean> {
  try {
    await obs.connect(`ws://${CONFIG.OBS.IP}:${CONFIG.OBS.PORT}`, CONFIG.OBS.PASSWORD, {
      rpcVersion: 1,
    });
    sendToRenderer("status-update", "✅ Connected to OBS");
    return true;
  } catch (error: any) {
    console.error('Failed to connect to OBS:', error);
    setTimeout(() => {
      console.log('Retrying connection to OBS...');
      connectToOBS();
    }, 5000);
    return false;
  }
}

function sendCustomKickChatMessage(messageDetails: {
  message: string;
  user: { name: string; color?: string; avatarUrl?: string };
  icon?: string;
  style?: 'message' | 'highlight' | 'error';
  col?: number;
}): void {
  const eventData = {
    origin: 'twitchat',
    type: 'CUSTOM_CHAT_MESSAGE',
    data: {
      message: messageDetails.message,
      canClose: false,
      user: {
        name: messageDetails.user.name,
        color: messageDetails.user.color ?? liveStyle.color,
        avatarUrl: messageDetails.user.avatarUrl ?? "https://www.kick.com/user-avatar.png",
      },
      icon: messageDetails.icon ?? liveStyle.icon,
      style: messageDetails.style ?? 'message',
      col: messageDetails.col ?? 2,
    },
  };

  obs.call("BroadcastCustomEvent", { eventData }).catch((error) => {
    console.error("Error broadcasting custom event to OBS:", error);
  });
}

function handleChatMessage(username: string, content: string) {
  console.log(`New message from ${username}: ${content}`);
  sendToRenderer("chat-message", { user: username, content });

  sendCustomKickChatMessage({
    message: content,
    user: {
      name: username,
      // 🧠 color and avatarUrl are optional — now liveStyle.color will be used
    },
    // icon is optional — will default to liveStyle.icon
    // style and col also fall back to defaults
  });
}

client.on("ready", () => {
  sendToRenderer("status-update", `✅ Connected to Kick channel ${CONFIG.KICK.CHANNEL}`);
});

client.on('ChatMessage', async (message: any) => {
  console.log(`${message.sender.username}: ${message.content}`);
  handleChatMessage(message.sender.username, message.content);
});

connectToOBS().then(() => {
  handleChatMessage('BBeskarKickSender', 'Successfully Connected to Kick Chat!');
});
