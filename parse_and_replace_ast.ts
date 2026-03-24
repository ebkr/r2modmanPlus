import fs from 'fs';
import path from 'path';
import { parse } from '@vue/compiler-sfc';

const allStringsByFile = JSON.parse(fs.readFileSync('english_strings_by_file.json', 'utf8'));

const enUsFile = fs.readFileSync('src/i18n/en-us/index.ts', 'utf8');
const match = enUsFile.match(/export default (\{[\s\S]*?\});/);
if (!match) process.exit(1);
let enUsObj = eval('(' + match[1] + ')');

let modifiedFiles = 0;

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

    const { descriptor } = parse(content);
    if (!descriptor.template || !descriptor.template.ast) continue;

    const replacements = [];

    function processNode(node: any) {
        if (!node) return;

        if (node.type === 2) { // TEXT node
            const textContent = node.content.trim();
            if (strings.includes(textContent) && !textContent.includes('{{') && !textContent.includes('}}') && !textContent.includes('$t(')) {
                let finalKey = stringToKey[textContent];
                if (!finalKey) {
                    let key = textContent.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 30).toLowerCase();
                    if (key.endsWith('_')) key = key.substring(0, key.length - 1);
                    if (key.startsWith('_')) key = key.substring(1);
                    if (key === '') key = 'text';

                    finalKey = key;
                    let counter = 1;
                    while (enUsObj[componentCat][finalKey] && enUsObj[componentCat][finalKey] !== textContent) {
                        finalKey = `${key}_${counter}`;
                        counter++;
                    }
                    enUsObj[componentCat][finalKey] = textContent;
                    stringToKey[textContent] = finalKey;
                }

                // Add to replacements using node's location
                replacements.push({
                    start: node.loc.start.offset,
                    end: node.loc.end.offset,
                    text: node.content,
                    replacementText: node.content.replace(textContent, `{{ $t('${componentCat}.${finalKey}') }}`)
                });
            }
        }

        if (node.type === 1) { // ELEMENT
            if (node.props) {
                for (const prop of node.props) {
                    if (prop.type === 6 && prop.value) { // ATTRIBUTE
                        const attrName = prop.name;
                        if (['placeholder', 'title', 'label', 'alt'].includes(attrName)) {
                            const attrContent = prop.value.content.trim();
                            if (strings.includes(attrContent)) {
                                let finalKey = stringToKey[attrContent];
                                if (!finalKey) {
                                    let key = attrContent.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').substring(0, 30).toLowerCase();
                                    if (key.endsWith('_')) key = key.substring(0, key.length - 1);
                                    if (key.startsWith('_')) key = key.substring(1);
                                    if (key === '') key = 'text';

                                    finalKey = key;
                                    let counter = 1;
                                    while (enUsObj[componentCat][finalKey] && enUsObj[componentCat][finalKey] !== attrContent) {
                                        finalKey = `${key}_${counter}`;
                                        counter++;
                                    }
                                    enUsObj[componentCat][finalKey] = attrContent;
                                    stringToKey[attrContent] = finalKey;
                                }

                                replacements.push({
                                    start: prop.loc.start.offset,
                                    end: prop.loc.end.offset,
                                    text: content.substring(prop.loc.start.offset, prop.loc.end.offset),
                                    replacementText: `:${attrName}="$t('${componentCat}.${finalKey}')"`
                                });
                            }
                        }
                    }
                }
            }
        }

        if (node.children) {
            for (const child of node.children) {
                processNode(child);
            }
        }
    }

    processNode(descriptor.template.ast);

    if (replacements.length > 0) {
        // Sort in reverse order by start offset so replacing doesn't mess up subsequent offsets
        replacements.sort((a, b) => b.start - a.start);

        let newContent = content;
        for (const rep of replacements) {
            newContent = newContent.substring(0, rep.start) + rep.replacementText + newContent.substring(rep.end);
        }

        fs.writeFileSync(path.join('./src', relPath), newContent, 'utf8');
        modifiedFiles++;
    }
}

fs.writeFileSync('src/i18n/en-us/index.ts', 'export default ' + JSON.stringify(enUsObj, null, 2) + ';\n', 'utf8');
console.log(`AST-based template refactor finished. Modified ${modifiedFiles} files.`);
