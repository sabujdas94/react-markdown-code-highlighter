// scripts/set-tag.js
const { version } = require('../package.json');
const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '../package.json');
const packageData = require(packagePath);
packageData.publishConfig = { tag: version.includes('beta') ? 'beta' : 'latest' }; // 动态修改 publishConfig
fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
