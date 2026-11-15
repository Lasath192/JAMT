/**
 * Restore Script: Reverts Astra-1 back to the pre-simplified UI snapshot
 * (preserving the Airlock Pressure Valve animation and all prior game state).
 *
 * Usage:
 *   node restore_previous_ui.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = __dirname;
const backupRoot = path.join(root, 'backups', 'pre-simplified-ui');

const files = [
    'index.html',
    'css/styles.css',
    'js/chapters.js',
    'js/activities.js',
    'js/simulation.js',
    'js/ui.js',
    'astra_1_the_red_frontier.html'
];

if (!fs.existsSync(backupRoot)) {
    console.error('ERROR: Backup directory not found at:', backupRoot);
    process.exit(1);
}

for (const rel of files) {
    const src = path.join(backupRoot, rel);
    const dst = path.join(root, rel);
    if (!fs.existsSync(src)) {
        console.error('ERROR: Missing backed-up file:', src);
        process.exit(1);
    }
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`✓ Restored ${rel}`);
}

const buildScript = path.join(root, 'build_standalone.js');
if (fs.existsSync(buildScript)) {
    console.log('Rebuilding standalone bundle via build_standalone.js...');
    execFileSync(process.execPath, [buildScript], { cwd: root, stdio: 'inherit' });
}

console.log('\n★ Previous UI version restored successfully! Refresh your browser to load the classic UI.');
