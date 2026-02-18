#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get current year
const currentYear = new Date().getFullYear();

// Update tauri.conf.json
const tauriConfigPath = path.join(__dirname, '../src-tauri/tauri.conf.json');
const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));

// Update copyright with current year
tauriConfig.bundle.copyright = `©${currentYear} Roboticela. All rights reserved.`;

// Write back to file
fs.writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + '\n');

console.log(`✅ Updated copyright year to ${currentYear}`);

