import fs from 'node:fs';
import path from 'node:path';

const exportRoot = path.resolve(process.cwd(), 'out');
const originalNotes = path.join(exportRoot, 'resources', 'original');
const relativeTarget = path.relative(exportRoot, originalNotes).split(path.sep).join('/');

if (relativeTarget !== 'resources/original') throw new Error(`Refusing to remove unexpected export path: ${originalNotes}`);
if (fs.existsSync(originalNotes)) fs.rmSync(originalNotes, { recursive: true, force: true });

console.log('Removed original notes from the public export; companion PDFs remain available.');
