import fs from 'fs';
import path from 'path';

const distPath = path.resolve('dist');

if (!fs.existsSync(distPath)) {
  console.log("dist directory does not exist.");
  process.exit(1);
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else {
      console.log(`Found built asset: ${fullPath} (${stat.size} bytes)`);
    }
  }
}

traverse(distPath);
