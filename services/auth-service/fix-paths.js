const fs = require('fs');
const path = require('path');

// Mapping of aliases to paths relative to dist root
const aliases = {
  '@config': './config',
  '@domain': './domain',
  '@application': './application',
  '@infrastructure': './infrastructure',
  '@ui': './ui',
  '@shared': './shared',
  '@jobmatch/shared': '../../../packages/shared/dist',
};

function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  const distRoot = path.join(__dirname, 'dist');

  // Convert toPath (starting with ./) to absolute path
  const toAbsolute = path.join(distRoot, toPath);

  // Get relative path from current file to target
  const relative = path.relative(fromDir, toAbsolute);

  // Normalize to forward slashes and ensure it starts with ./
  let result = relative.replace(/\\/g, '/');
  if (!result.startsWith('.')) {
    result = './' + result;
  }

  return result;
}

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  Object.entries(aliases).forEach(([alias, replacement]) => {
    // Match require statements with the alias
    const aliasRegex = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`require\\(["']${aliasRegex}([^"']*)["']\\)`, 'g');

    if (pattern.test(content)) {
      modified = true;
      content = content.replace(pattern, (match, rest) => {
        // Calculate relative path from this file to the target
        const targetPath = replacement + rest;
        const relativePath = getRelativePath(filePath, targetPath);
        return `require("${relativePath}")`;
      });
    }
  });

  // Ensure all local requires have .js extension if they don't and they're files
  const localRequirePattern = /require\(["'](\.[^"']*?)["']\)/g;
  content = content.replace(localRequirePattern, (match, requirePath) => {
    // Skip if it's external package
    if (requirePath.startsWith('@') || requirePath.includes('node_modules')) {
      return match;
    }

    // Skip if already has .js or ends with / (directory)
    if (requirePath.endsWith('.js') || requirePath.endsWith('/')) {
      return match;
    }

    // Check if this looks like a directory path (ends with /dist, /index, or contains /packages)
    if (
      requirePath.includes('/packages') ||
      requirePath.endsWith('/index') ||
      requirePath.endsWith('/dist')
    ) {
      // Likely a directory reference to index.js, don't add .js
      return match;
    }

    // Try to determine if it's a directory by checking file system
    const distRoot = path.join(__dirname, 'dist');
    const targetPath = path.join(distRoot, requirePath);

    try {
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        // It's a directory, Node will look for index.js
        return match;
      }
    } catch {
      // File doesn't exist, that's ok - add .js anyway
    }

    // Check if .js version exists
    if (fs.existsSync(targetPath + '.js')) {
      return `require("${requirePath}.js")`;
    }

    // If not found with .js either, try without change
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

// Walk through all .js files in dist
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  });
}

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  walkDir(distDir);
  console.log('Path fixing complete');
} else {
  console.log('dist directory not found');
}
