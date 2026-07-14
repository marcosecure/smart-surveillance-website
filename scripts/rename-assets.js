const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'assets');
const exts = ['.html', '.css', '.js'];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  items.forEach((it) => {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) return walk(full);
    const newName = it.name.replace(/\s+/g, '-');
    if (newName !== it.name) {
      const newFull = path.join(dir, newName);
      console.log('Renaming', full, '->', newFull);
      fs.renameSync(full, newFull);
    }
  });
}

function updateReferences() {
  const files = fs.readdirSync(path.join(__dirname, '..'));
  files.forEach((fname) => {
    if (!exts.includes(path.extname(fname))) return;
    const filePath = path.join(__dirname, '..', fname);
    let content = fs.readFileSync(filePath, 'utf8');
    const updated = content.replace(/assets\/([^"'\)\s]+)/g, (m, p1) => {
      const clean = p1.replace(/\s+/g, '-');
      return `assets/${clean}`;
    });
    if (updated !== content) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log('Updated references in', fname);
    }
  });
}

console.log('Renaming files inside assets to remove spaces...');
walk(root);
console.log('Updating references in root HTML/CSS/JS files...');
updateReferences();
console.log('Done. Review changes and commit.');
