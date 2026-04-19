#!/usr/bin/env node
/**
 * postinstall.js
 * Automatically builds the TypeScript source after `npm install pobjan/expo-captions-settings`.
 * Runs `expo-module build` (from expo-module-scripts) so the consumer gets ready-to-use JS + .d.ts files.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const buildDir = path.join(__dirname, "..", "build");
const srcDir = path.join(__dirname, "..", "src");

// If `build/` already exists and is up-to-date, skip rebuild.
if (fs.existsSync(buildDir) && fs.readdirSync(buildDir).length > 0) {
  console.log("[expo-captions-settings] ✅ Build already exists, skipping.");
  process.exit(0);
}

console.log("[expo-captions-settings] 🔨 Building TypeScript sources...");

try {
  execSync("npx expo-module build", {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
  });
  console.log("[expo-captions-settings] ✅ Build complete.");
} catch (e) {
  // Build failures are non-fatal – the module may already be pre-built or
  // the consumer may be using Babel/Metro to transpile on the fly.
  console.warn(
    "[expo-captions-settings] ⚠️  Build step failed (this may be fine if you use Metro):",
    e.message
  );
}
