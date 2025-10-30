const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const declaredDeps = new Set([
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {})
]);

// Scan for imports
const usedPackages = new Set();

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /(?:import|from|require\()\s*['"]([\w@-]+(?:\/[\w-]+)?)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const pkg = match[1];
      // Skip local imports (starting with . or /)
      if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
        // Extract base package name (handle scoped packages)
        const basePkg = pkg.startsWith('@') 
          ? pkg.split('/').slice(0, 2).join('/')
          : pkg.split('/')[0];
        usedPackages.add(basePkg);
      }
    }
  } catch (e) {
    // Skip files that can't be read
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      scanDirectory(fullPath);
    } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      scanFile(fullPath);
    }
  }
}

console.log('Scanning for package imports...\n');
scanDirectory('src');

// Find missing packages
const missing = [];
for (const pkg of usedPackages) {
  if (!declaredDeps.has(pkg) && pkg !== 'react' && pkg !== 'next') {
    missing.push(pkg);
  }
}

console.log('Missing packages that need to be added:\n');
console.log(missing.sort().join('\n'));
console.log(`\nTotal: ${missing.length} missing packages`);