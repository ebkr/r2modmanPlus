const fs = require('fs');
const loaderUtils = require('loader-utils');
const path = require('path');

module.exports = function (source) {
  const options = loaderUtils.getOptions(this);

  const filename = path.parse(this.resourcePath).name;

  const extension = (options && options.extension) || '.jest.spec.js';
  const dir = `${this.context}/__tests__`;
  console.log(`Created test file: ${filename}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const code = source.replace(/\n{2,}/, '');
  const dest = `${dir}/${filename}${extension}`;
  fs.writeFileSync(dest, code);
  return `<!-- Created test file: ${filename} -->`;
};
