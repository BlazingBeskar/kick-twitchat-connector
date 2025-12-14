# Build Scripts

## build-mac-icon.sh

Converts `assets/icon.ico` to `assets/icon.icns` for macOS builds.

### Requirements
- macOS (uses `sips` and `iconutil` built-in tools)

### Usage

```bash
npm run build:mac-icon
```

Or run directly:

```bash
./scripts/build-mac-icon.sh
```

### What it does
1. Extracts a PNG from the `.ico` file
2. Creates an iconset with all required sizes (16x16 to 1024x1024)
3. Converts the iconset to `.icns` format
4. Cleans up temporary files

### When to use
- Before building for macOS for the first time
- After updating the Windows icon (`assets/icon.ico`)

