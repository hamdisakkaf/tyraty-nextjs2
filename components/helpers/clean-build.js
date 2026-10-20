// scripts/clean-build.js
const fs = require('fs');
const path = require('path');

function deleteFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✅ Deleted: ${folderPath}`);
  }
}

// حذف المجلدات الكبيرة غير الضرورية
const foldersToDelete = [
  '.next/cache',
  '.next/server',
  '.next/static/chunks/polyfills-*.js',
];

foldersToDelete.forEach(folder => {
  const fullPath = path.join(process.cwd(), folder);
  deleteFolder(fullPath);
});

console.log('🧹 Cleanup complete!');