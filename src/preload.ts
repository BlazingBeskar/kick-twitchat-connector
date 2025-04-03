import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveConfig: (config: any) => ipcRenderer.send('save-config', config),
  startApp: () => ipcRenderer.send('start-app'),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  onStatusUpdate: (callback: (msg: string) => void) => {
    ipcRenderer.on('status-update', (_event, msg) => callback(msg));
  },
  onChatMessage: (callback: (data: { user: string; content: string }) => void) => {
    ipcRenderer.on('chat-message', (_event, data) => callback(data));
  },
  updateMessageStyle: (data: { color: string; icon: string }) => {
    ipcRenderer.send('update-style', data);
  },
  onColumnCount: (callback: (count: number) => void) => {
    ipcRenderer.on('column-count', (_event, count) => callback(count));
  },
});


console.log("✅ preload.js loaded");