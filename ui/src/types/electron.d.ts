export {};

declare global {
  interface Window {
    electronAPI: {
      saveConfig: (config: any) => void;
      startApp: () => void;
      onStatusUpdate: (callback: (msg: string) => void) => void;
      onChatMessage: (callback: (data: { user: string; content: string }) => void) => void;
      updateMessageStyle: (data: { color: string; icon: string }) => void; // ✅ Add this
    };
  }
}