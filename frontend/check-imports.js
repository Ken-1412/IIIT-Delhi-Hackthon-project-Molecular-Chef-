import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

const files = getAllFiles(srcDir);
const imports = [];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        const match = line.match(/import\s+.*\s+from\s+['"](.*)['"]/);
        if (match) {
            imports.push({
                file,
                line: index + 1,
                source: match[1]
            });
        }
    });
});

console.log(`Found ${imports.length} imports.`);

// check for missing local files
imports.forEach(imp => {
    if (imp.source.startsWith('.')) {
        const dir = path.dirname(imp.file);
        const target = path.resolve(dir, imp.source);

        // Check extensions
        const extensions = ['', '.js', '.jsx', '.json'];
        let found = false;
        for (const ext of extensions) {
            if (fs.existsSync(target + ext)) {
                found = true;
                break;
            }
        }

        if (!found) {
            console.error(`ERROR: Missing import in ${path.relative(__dirname, imp.file)}:${imp.line} -> ${imp.source}`);
        }
    } else {
        // Check node_modules (simple check)
        // actually just check package.json deps?
    }
});

console.log('Check complete.');
