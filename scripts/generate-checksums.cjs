const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Generate SHA256 checksums for all build artifacts
 */

function generateChecksum(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function findBuildArtifacts(bundleDir) {
  const artifacts = [];
  
  if (!fs.existsSync(bundleDir)) {
    console.log('⚠ Bundle directory not found:', bundleDir);
    return artifacts;
  }
  
  function scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.isFile()) {
        // Include all build artifacts except checksums
        const ext = path.extname(entry.name).toLowerCase();
        const isArtifact = [
          '.exe', '.msi', '.nsis.zip',  // Windows
          '.dmg', '.app', '.pkg',        // macOS
          '.appimage', '.deb', '.rpm',   // Linux
          '.apk', '.aab',                // Android
          '.ipa',                        // iOS
        ].some(ending => entry.name.toLowerCase().endsWith(ending));
        
        if (isArtifact && !entry.name.endsWith('.sha256')) {
          artifacts.push(fullPath);
        }
      }
    }
  }
  
  scanDirectory(bundleDir);
  return artifacts;
}

async function generateAllChecksums() {
  console.log('🔐 Generating SHA256 checksums for build artifacts...\n');
  
  const bundleDir = path.join(__dirname, '..', 'src-tauri', 'target', 'release', 'bundle');
  const artifacts = await findBuildArtifacts(bundleDir);
  
  if (artifacts.length === 0) {
    console.log('⚠ No build artifacts found. Build the app first with: npm run tauri build\n');
    return;
  }
  
  const checksums = [];
  
  for (const artifact of artifacts) {
    try {
      const checksum = await generateChecksum(artifact);
      const relativePath = path.relative(bundleDir, artifact);
      const checksumFile = artifact + '.sha256';
      const checksumContent = `${checksum}  ${path.basename(artifact)}`;
      
      // Write checksum file
      fs.writeFileSync(checksumFile, checksumContent + '\n');
      
      checksums.push({
        file: relativePath,
        checksum: checksum,
        size: fs.statSync(artifact).size
      });
      
      console.log('✓', relativePath);
      console.log('  SHA256:', checksum);
      console.log('  Size:', (fs.statSync(artifact).size / 1024 / 1024).toFixed(2), 'MB\n');
    } catch (error) {
      console.error('✗ Failed to generate checksum for', artifact, ':', error.message);
    }
  }
  
  // Generate checksums manifest
  const manifestPath = path.join(bundleDir, 'CHECKSUMS.txt');
  let manifestContent = `# SHA256 Checksums\n`;
  manifestContent += `# Generated: ${new Date().toISOString()}\n`;
  manifestContent += `# Restaurant Management System v${require('../package.json').version}\n\n`;
  
  for (const item of checksums) {
    manifestContent += `${item.checksum}  ${item.file}\n`;
  }
  
  fs.writeFileSync(manifestPath, manifestContent);
  
  console.log('📋 Checksum manifest created:', path.relative(process.cwd(), manifestPath));
  console.log(`\n✅ Generated ${checksums.length} checksum(s) successfully!`);
}

// Run if called directly
if (require.main === module) {
  generateAllChecksums().catch(console.error);
}

module.exports = { generateChecksum, generateAllChecksums };

