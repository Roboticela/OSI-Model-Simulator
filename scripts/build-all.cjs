#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Build for all platforms and architectures
 */

const builds = [
  // Linux
  { platform: 'Linux', arch: 'x86_64', target: 'x86_64-unknown-linux-gnu', command: 'tauri build' },
  { platform: 'Linux', arch: 'aarch64', target: 'aarch64-unknown-linux-gnu', command: 'tauri build' },
  { platform: 'Linux', arch: 'armv7', target: 'armv7-unknown-linux-gnueabihf', command: 'tauri build' },
  
  // Windows
  { platform: 'Windows', arch: 'x86_64', target: 'x86_64-pc-windows-msvc', command: 'tauri build' },
  { platform: 'Windows', arch: 'aarch64', target: 'aarch64-pc-windows-msvc', command: 'tauri build' },
  { platform: 'Windows', arch: 'i686', target: 'i686-pc-windows-msvc', command: 'tauri build' },
  
  // macOS
  { platform: 'macOS', arch: 'x86_64', target: 'x86_64-apple-darwin', command: 'tauri build' },
  { platform: 'macOS', arch: 'aarch64', target: 'aarch64-apple-darwin', command: 'tauri build' },
  
  // Android (uses short names)
  { platform: 'Android', arch: 'aarch64', target: 'aarch64', command: 'tauri android build', androidTarget: true },
  { platform: 'Android', arch: 'armv7', target: 'armv7', command: 'tauri android build', androidTarget: true },
  { platform: 'Android', arch: 'x86_64', target: 'x86_64', command: 'tauri android build', androidTarget: true },
  { platform: 'Android', arch: 'i686', target: 'i686', command: 'tauri android build', androidTarget: true },
];

const results = {
  success: [],
  failed: [],
  skipped: []
};

function exec(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf-8',
      ...options 
    });
  } catch (error) {
    throw error;
  }
}

async function buildForTarget(build) {
  const { platform, arch, target, command } = build;
  const label = `${platform} (${arch})`;
  
  console.log('\n' + '='.repeat(70));
  console.log(`🔨 Building for ${label}`);
  console.log(`   Target: ${target}`);
  console.log('='.repeat(70) + '\n');
  
  try {
    // Check if this is a cross-compilation scenario
    const currentPlatform = process.platform;
    const needsCrossCompiler = 
      (platform === 'Windows' && currentPlatform !== 'win32') ||
      (platform === 'macOS' && currentPlatform !== 'darwin') ||
      (platform === 'Linux' && currentPlatform !== 'linux');
    
    // iOS requires macOS and Xcode
    if (platform === 'iOS' && currentPlatform !== 'darwin') {
      console.log(`⚠️  Skipping ${label} - iOS builds require macOS with Xcode\n`);
      results.skipped.push({ ...build, reason: 'Requires macOS with Xcode' });
      return;
    }
    
    // Android builds
    if (platform === 'Android') {
      // Check if Android SDK is available
      if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
        // Try to find Android SDK
        const possiblePaths = [
          process.env.HOME + '/Android/Sdk',
          '/opt/android-sdk',
          '/usr/lib/android-sdk'
        ];
        
        let androidSdkFound = false;
        for (const sdkPath of possiblePaths) {
          if (fs.existsSync(sdkPath)) {
            process.env.ANDROID_HOME = sdkPath;
            androidSdkFound = true;
            console.log(`   Found Android SDK at: ${sdkPath}`);
            break;
          }
        }
        
        if (!androidSdkFound) {
          console.log(`⚠️  Skipping ${label} - Android SDK not found\n`);
          console.log(`   Install Android Studio or set ANDROID_HOME environment variable\n`);
          results.skipped.push({ ...build, reason: 'Android SDK not configured' });
          return;
        }
      }
      
      // Check if Android project is initialized
      const androidDir = path.join(process.cwd(), 'src-tauri', 'gen', 'android');
      if (!fs.existsSync(androidDir)) {
        console.log(`⚠️  Skipping ${label} - Android project not initialized\n`);
        console.log(`   Run: npm run tauri android init\n`);
        results.skipped.push({ ...build, reason: 'Android project not initialized' });
        return;
      }
      
      try {
        exec(`npm run tauri android build --target ${target} --apk`);
        results.success.push(build);
        console.log(`\n✅ Successfully built ${label}\n`);
      } catch (error) {
        console.error(`\n❌ Failed to build ${label}`);
        console.error(`   Error: ${error.message}\n`);
        results.failed.push({ ...build, error: error.message });
      }
      return;
    }
    
    // Desktop builds
    if (needsCrossCompiler) {
      console.log(`⚠️  Cross-compilation detected for ${label}`);
      console.log(`   Current platform: ${currentPlatform}, Target: ${platform}`);
      
      // Try to build anyway - some cross-compilation might work with proper tools
      if (platform === 'Windows' && currentPlatform === 'linux') {
        // Check for mingw
        try {
          execSync('which x86_64-w64-mingw32-gcc', { stdio: 'pipe' });
          console.log('   MinGW found, attempting cross-compilation...\n');
        } catch {
          console.log(`⚠️  Skipping ${label} - MinGW cross-compiler not found`);
          console.log('   Install with: sudo apt install mingw-w64\n');
          results.skipped.push({ ...build, reason: 'MinGW not installed' });
          return;
        }
      } else if (platform === 'macOS') {
        console.log(`⚠️  Skipping ${label} - macOS builds require macOS or OSXCross`);
        console.log('   Cross-compilation to macOS is complex and not recommended\n');
        results.skipped.push({ ...build, reason: 'Requires macOS or OSXCross' });
        return;
      }
    }
    
    // Attempt the build
    try {
      exec(`npm run tauri build --target ${target}`);
      results.success.push(build);
      console.log(`\n✅ Successfully built ${label}\n`);
    } catch (error) {
      console.error(`\n❌ Failed to build ${label}`);
      console.error(`   Error: ${error.message}\n`);
      results.failed.push({ ...build, error: error.message });
    }
    
  } catch (error) {
    console.error(`\n❌ Unexpected error building ${label}`);
    console.error(`   Error: ${error.message}\n`);
    results.failed.push({ ...build, error: error.message });
  }
}

async function main() {
  console.log('\n🚀 Starting multi-platform build process...\n');
  console.log(`Current platform: ${process.platform}`);
  console.log(`Current architecture: ${process.arch}\n`);
  
  // First, build the frontend
  console.log('📦 Building frontend...\n');
  try {
    exec('npm run build');
    console.log('✅ Frontend built successfully\n');
  } catch (error) {
    console.error('❌ Failed to build frontend:', error.message);
    process.exit(1);
  }
  
  // Build for each target
  for (const build of builds) {
    await buildForTarget(build);
  }
  
  // Generate checksums
  console.log('\n' + '='.repeat(70));
  console.log('🔐 Generating checksums for all builds...');
  console.log('='.repeat(70) + '\n');
  
  try {
    exec('node scripts/generate-checksums.cjs');
  } catch (error) {
    console.warn('⚠️  Failed to generate checksums:', error.message);
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Build Summary');
  console.log('='.repeat(70) + '\n');
  
  console.log(`✅ Successful builds: ${results.success.length}`);
  if (results.success.length > 0) {
    results.success.forEach(b => {
      console.log(`   - ${b.platform} (${b.arch})`);
    });
  }
  
  console.log(`\n❌ Failed builds: ${results.failed.length}`);
  if (results.failed.length > 0) {
    results.failed.forEach(b => {
      console.log(`   - ${b.platform} (${b.arch}): ${b.error}`);
    });
  }
  
  console.log(`\n⚠️  Skipped builds: ${results.skipped.length}`);
  if (results.skipped.length > 0) {
    results.skipped.forEach(b => {
      console.log(`   - ${b.platform} (${b.arch}): ${b.reason}`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
  
  if (results.success.length > 0) {
    console.log('\n✅ Build artifacts available in:');
    console.log('   src-tauri/target/release/bundle/\n');
  }
  
  // Exit code
  if (results.failed.length > 0) {
    console.log('⚠️  Some builds failed. See details above.\n');
    process.exit(1);
  } else if (results.success.length === 0) {
    console.log('⚠️  No builds completed successfully.\n');
    process.exit(1);
  } else {
    console.log('🎉 All attempted builds completed successfully!\n');
  }
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

