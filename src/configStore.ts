import { app } from 'electron';
import fs from 'fs';
import path from 'path';

const configPath = path.join(app.getPath('userData'), 'config.json');

export function ensureDefaultConfig(): any {
  if (!fs.existsSync(configPath)) {
    const defaultConfig = {
      KICK: { CHANNEL: "", LOGGER: true, READ_ONLY: true },
      OBS: { IP: "localhost", PORT: 4455, PASSWORD: "" }
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  } else {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
}

export function saveConfig(config: any) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getConfigPath() {
  return configPath;
}
