const fs = require('fs');

// Read modular files
const css = fs.readFileSync('css/styles.css', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const jsFiles = [
    'js/soundfx.js',
    'js/nasa_data.js',
    'js/chapters.js',
    'js/simulation.js',
    'js/render.js',
    'js/render3d.js',
    'js/activities.js',
    'js/ui.js',
    'js/game.js'
];

let bundleJs = '';
for (const file of jsFiles) {
    bundleJs += `\n/* ===== BUNDLE: ${file} ===== */\n` + fs.readFileSync(file, 'utf8') + '\n';
}

let standaloneHtml = indexHtml;

// Replace <link rel="stylesheet" href="css/styles.css"> with <style>...</style>
standaloneHtml = standaloneHtml.replace(
    /<link rel="stylesheet" href="css\/styles\.css">/,
    `<style>\n${css}\n</style>`
);

// Optional: inline story images in assets/story as Base64 in astra_1_the_red_frontier.html
const storyDir = 'assets/story';
if (fs.existsSync(storyDir)) {
    const storyImages = fs.readdirSync(storyDir);
    for (const imgName of storyImages) {
        if (imgName.endsWith('.jpg')) {
            const b64 = fs.readFileSync(`${storyDir}/${imgName}`).toString('base64');
            const dataUri = `data:image/jpeg;base64,${b64}`;
            standaloneHtml = standaloneHtml.split(`assets/story/${imgName}`).join(dataUri);
        }
    }
}

// Replace modular <script src="js/..."></script> tags with inlined <script>bundleJs</script>
const scriptTagsRegex = /<!-- Modular Mission Engine Scripts[\s\S]*?<\/body>/;
const scriptReplacement = `<!-- STANDALONE INLINED JAVASCRIPT BUNDLE (2026 NASA Space Apps Challenge) -->\n    <script>\n${bundleJs}\n    </script>\n</body>`;

if (!scriptTagsRegex.test(standaloneHtml)) {
    console.error('ERROR: scriptTagsRegex did not match!');
    process.exit(1);
}

standaloneHtml = standaloneHtml.replace(scriptTagsRegex, scriptReplacement);

fs.writeFileSync('astra_1_the_red_frontier.html', standaloneHtml, 'utf8');
console.log('Successfully built standalone astra_1_the_red_frontier.html (Size: ' + standaloneHtml.length.toLocaleString() + ' bytes)');
