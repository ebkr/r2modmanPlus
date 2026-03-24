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
            // Generate key if it doesn't exist
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
        }

        const words = str.split(/\s+/).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const wsStrRegex = words.join('\\s+');

        // We use a regex that safely matches the string. Since Vue text nodes are split by newlines, we use \s+
        // Match `>...TARGET...<`. Be careful not to replace text inside attributes if it's not the whole attribute value.
        // Actually, matching `>([^<]*?)(TARGET)([^<]*?)<` was not working for tags spanning multiple lines. Let's use `[\s\S]*?`

        const textRegex = new RegExp(`>([^<]*?)(${wsStrRegex})([^<]*?)<`, 'g');
        let tempTemplateStr = templateStr;
        while(true) {
            let replaced = tempTemplateStr.replace(textRegex, (m, p1, p2, p3) => {
                if(p1.includes('{{') || p3.includes('}}') || p1.includes('$t(') || p3.includes('$t(')) return m;
                return `>${p1}{{ $t('${componentCat}.${finalKey}') }}${p3}<`;
            });
            if (replaced === tempTemplateStr) break;
            tempTemplateStr = replaced;
        }
        templateStr = tempTemplateStr;

        const attrRegex = new RegExp(`(placeholder|title|label|alt)=["'](${wsStrRegex})["']`, 'g');
        templateStr = templateStr.replace(attrRegex, (match, attrName) => {
            return `:${attrName}="$t('${componentCat}.${finalKey}')"`;
        });
    }

    if (templateStr !== templateMatch[0]) {
        content = content.replace(templateMatch[0], templateStr);
        fs.writeFileSync(path.join('./src', relPath), content, 'utf8');
        modifiedFiles++;
    }
}

fs.writeFileSync('src/i18n/en-us/index.ts', 'export default ' + JSON.stringify(enUsObj, null, 2) + ';\n', 'utf8');
console.log(`Refactored templates. Modified ${modifiedFiles} files.`);
