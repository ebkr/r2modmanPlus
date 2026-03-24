import fs from 'fs';
import path from 'path';

const allStringsByFile = JSON.parse(fs.readFileSync('english_strings_by_file.json', 'utf8'));

const enUsFile = fs.readFileSync('src/i18n/en-us/index.ts', 'utf8');
const match = enUsFile.match(/export default (\{[\s\S]*?\});/);
if (!match) {
    console.error("Could not parse en-us index.ts");
    process.exit(1);
}
let enUsObj;
try {
    enUsObj = eval('(' + match[1] + ')');
} catch (e) {
    console.error("Error evaluating", e);
    process.exit(1);
}

let modifiedFiles = 0;

for (const [relPath, strings] of Object.entries(allStringsByFile)) {
    const filename = path.basename(relPath, '.vue');
    let content = fs.readFileSync(path.join('./src', relPath), 'utf8');
    const componentCat = filename.replace(/[^a-zA-Z0-9]/g, '');

    if (!enUsObj[componentCat]) enUsObj[componentCat] = {};
    const translations = enUsObj[componentCat];

    const stringToKey = {};
    for (const [k, v] of Object.entries(translations)) {
        stringToKey[v] = k;
    }

    const templateMatch = content.match(/<template>[\s\S]*?<\/template>/);
    if (!templateMatch) continue;

    let templateStr = templateMatch[0];

    for (const str of strings) {
        if (str.includes('{{') || str.includes('}}') || str.includes('$t(')) continue;

        let finalKey = stringToKey[str];
        if (!finalKey) {
            let key = str.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 30).toLowerCase();
            if (key.endsWith('_')) key = key.substring(0, key.length - 1);
            if (key.startsWith('_')) key = key.substring(1);
            if (key === '') key = 'text';

            finalKey = key;
            let counter = 1;
            while (enUsObj[componentCat][finalKey] && enUsObj[componentCat][finalKey] !== str) {
                finalKey = `${key}_${counter}`;
                counter++;
            }
            enUsObj[componentCat][finalKey] = str;
            stringToKey[str] = finalKey;
        }

        const safeStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // This time, instead of `>([^<]*?)(TARGET)([^<]*?)<`, let's just do a plain string replace for instances not wrapped in tags or templates.
        // But doing `.replace()` directly on the template string is dangerous. Let's try it but only if there is a > directly before and a < directly after, but allowing any spaces.
        // e.g. `>\s*TARGET\s*<`

        let wsRegex = new RegExp(`>(\\s*)(${safeStr})(\\s*)<`, 'g');
        let tempTemplateStr = templateStr;
        while(true) {
            let replaced = tempTemplateStr.replace(wsRegex, `>$1{{ $t('${componentCat}.${finalKey}') }}$3<`);
            if (replaced === tempTemplateStr) break;
            tempTemplateStr = replaced;
        }
        templateStr = tempTemplateStr;

        // Let's also handle elements where the text has inner HTML tags.
        // Oh wait, `parseNode` gives us text nodes. If a paragraph has `<a>link</a> text`, the ` text` is a text node.
        // It's just `> text <` or `> text` or `text <`.
        // Let's replace just the exact match if it doesn't look like code.

        // We'll replace occurrences that are NOT inside attributes (except specific ones), NOT inside {{ }}, NOT inside script.
        // Since we are inside the template string, and we replace from longest to shortest.

        // Let's just do a replace all, but manually skip if inside {{ }} or HTML tag `<...>`
        // This requires parsing character by character or complex regex.
    }

    // As a more advanced replacement, let's use the compiler-sfc to map the locations. No wait, SFC AST gives us exact line/col locations!
}

// Write back...
