#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

/**
 * Verify SHA256 checksum of a file
 * Usage: node verify-checksum.cjs <file> [checksum-file]
 */

function calculateChecksum(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function verifyFile(filePath, checksumFile) {
  console.log('🔍 Verifying file integrity...\n');
  console.log('File:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ Error: File not found:', filePath);
    process.exit(1);
  }
  
  // Read expected checksum
  let expectedChecksum;
  if (checksumFile) {
    if (!fs.existsSync(checksumFile)) {
      console.error('❌ Error: Checksum file not found:', checksumFile);
      process.exit(1);
    }
    const content = fs.readFileSync(checksumFile, 'utf-8').trim();
    expectedChecksum = content.split(/\s+/)[0].toLowerCase();
  } else {
    // Try to find .sha256 file
    const autoChecksumFile = filePath + '.sha256';
    if (fs.existsSync(autoChecksumFile)) {
      const content = fs.readFileSync(autoChecksumFile, 'utf-8').trim();
      expectedChecksum = content.split(/\s+/)[0].toLowerCase();
      checksumFile = autoChecksumFile;
    } else {
      console.error('❌ Error: No checksum file specified and', autoChecksumFile, 'not found');
      console.log('\nUsage: node verify-checksum.cjs <file> [checksum-file]');
      process.exit(1);
    }
  }
  
  console.log('Checksum file:', checksumFile);
  console.log('\nCalculating SHA256...');
  
  // Calculate actual checksum
  const actualChecksum = await calculateChecksum(filePath);
  
  console.log('\nExpected:', expectedChecksum);
  console.log('Actual:  ', actualChecksum);
  
  // Compare
  if (actualChecksum === expectedChecksum) {
    console.log('\n✅ SUCCESS: Checksum verified! File is authentic and unmodified.\n');
    process.exit(0);
  } else {
    console.log('\n❌ FAILURE: Checksum mismatch! File may be corrupted or tampered with.\n');
    process.exit(1);
  }
}

// Main
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Verify SHA256 Checksum
======================

Usage:
  node verify-checksum.cjs <file> [checksum-file]

Examples:
  # Automatic (looks for file.sha256)
  node verify-checksum.cjs Restaurant-Management-System.exe

  # Manual checksum file
  node verify-checksum.cjs Restaurant-Management-System.exe checksums.txt

  # Verify from any directory
  node verify-checksum.cjs /path/to/installer.dmg /path/to/installer.dmg.sha256
`);
  process.exit(0);
}

const filePath = path.resolve(args[0]);
const checksumFile = args[1] ? path.resolve(args[1]) : null;

verifyFile(filePath, checksumFile).catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

