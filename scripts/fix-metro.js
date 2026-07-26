const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'node_modules', '@tybys', 'wasm-util', 'dist');
try {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.js'), 'module.exports = {};');
    console.log('Fixed Metro watcher stub directory for @tybys/wasm-util');
  }
} catch (e) {
  // Silent fallback
}
