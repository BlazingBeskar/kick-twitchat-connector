export {};

declare global {
  interface Window {
    electronAPI: {
      saveConfig: (config: any) => void;
      startApp: () => void;
      onStatusUpdate: (callback: (msg: string) => void) => void;
      onChatMessage: (callback: (data: { user: string; content: string }) => void) => void;

      // Sends style info to OBS (color, icon, and optional column index)
      updateMessageStyle: (data: { color: string; icon: string; col?: number }) => void;
      
      loadConfig: () => Promise<any>; 
      onColumnCount: (callback: (count: number) => void) => void;
    };
  }
}
