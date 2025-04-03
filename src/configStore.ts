import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const configPath = path.join(app.getPath('userData'), 'config.json');

export function ensureDefaultConfig(): any {
  // 🔐 Ensure directory exists
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      KICK: { CHANNEL: "", LOGGER: true, READ_ONLY: true },
      OBS: { IP: "localhost", PORT: 4455, PASSWORD: "" }
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    console.log("🆕 Created default config:", configPath);
    return defaultConfig;
  } else {
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    console.log("📖 Loaded config from:", configPath);
    return JSON.parse(configRaw);
  }
}

export function saveConfig(config: any) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getConfigPath() {
  return configPath;
}
