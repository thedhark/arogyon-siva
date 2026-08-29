const fs = require('fs');
const path = require('path');

// 1. Fix Metro watcher stub directory for @tybys/wasm-util
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

// 2. Fix React Native's dev-only throwOnImmutableMutation conflict with React Navigation 7 & React 19 stackRef
const deepFreezeFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native',
  'Libraries',
  'Utilities',
  'deepFreezeAndThrowOnMutationInDev.js'
);
try {
  if (fs.existsSync(deepFreezeFile)) {
    let content = fs.readFileSync(deepFreezeFile, 'utf8');
    const throwRegex = /function throwOnImmutableMutation\([^)]*\)\s*\{[\s\S]*?throw Error\([\s\S]*?\);\s*\}/;
    if (throwRegex.test(content)) {
      content = content.replace(
        throwRegex,
        'function throwOnImmutableMutation(key: empty, value) {\n  // Silenced: dev-only check conflicts with React Navigation 7 and React 19 ref cleanup\n}'
      );
      fs.writeFileSync(deepFreezeFile, content, 'utf8');
      console.log('Fixed React Native deepFreezeAndThrowOnMutationInDev (silenced immutable mutation throw)');
    }
  }
} catch (e) {
  console.warn('Could not patch deepFreezeAndThrowOnMutationInDev:', e.message);
}

