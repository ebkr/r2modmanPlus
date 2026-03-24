import fs from 'fs';
import path from 'path';
import { parse } from '@vue/compiler-sfc';

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    }
    next();
  });
}

function processNode(node: any, results: any[]) {
    if (!node) return;

    if (node.type === 2) { // TEXT node
        const content = node.content.trim();
        if (content && content.length > 1 && !/^[0-9\s]+$/.test(content) && !/^[_\W]+$/.test(content)) {
            if (/[a-zA-Z]/.test(content)) {
                results.push(content);
            }
        }
    }

    if (node.type === 1) { // ELEMENT
        if (node.props) {
            for (const prop of node.props) {
                if (prop.type === 6 && prop.value) { // ATTRIBUTE
                    const attrName = prop.name;
                    if (['placeholder', 'title', 'label', 'alt'].includes(attrName)) {
                        const content = prop.value.content.trim();
                        if (content && content.length > 1 && !/^[0-9\s]+$/.test(content) && !/^[_\W]+$/.test(content)) {
                            if (/[a-zA-Z]/.test(content)) {
                                results.push(content);
                            }
                        }
                    }
                }
            }
        }
    }

    if (node.children) {
        for (const child of node.children) {
            processNode(child, results);
        }
    }
}

walk('./src', function(err, results) {
  if (err) throw err;
  const vueFiles = results.filter(f => f.endsWith('.vue'));
  const allStringsByFile = {};
  for (const file of vueFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const { descriptor } = parse(content);
    if (!descriptor.template) continue;

    const strings: any[] = [];
    if (descriptor.template.ast) {
        processNode(descriptor.template.ast, strings);
    }

    const relFile = path.relative('./src', file);
    if (strings.length > 0) {
        allStringsByFile[relFile] = [];
        for(let s of strings) {
            // we must not match things already replaced with $t(..)
            if(!s.includes('{{') && !s.includes('}}') && !s.includes('$t(')) {
                allStringsByFile[relFile].push(s);
            }
        }
        if (allStringsByFile[relFile].length === 0) {
            delete allStringsByFile[relFile];
        } else {
            // Sort to prevent partial matching later
            allStringsByFile[relFile] = [...new Set(allStringsByFile[relFile])].sort((a, b) => b.length - a.length);
        }
    }
  }

  fs.writeFileSync('english_strings_by_file.json', JSON.stringify(allStringsByFile, null, 2));
  console.log(`Extracted strings to english_strings_by_file.json. Files with strings: ${Object.keys(allStringsByFile).length}`);
});
