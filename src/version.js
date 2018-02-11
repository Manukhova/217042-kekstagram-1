const colors = require('colors');

const packageInfo = require(`../package.json`);
const packageVersion = packageInfo.version.split('.');
const major = colors.red(packageVersion[0]);
const minor = colors.green(packageVersion[1]);
const patch = colors.blue(packageVersion[2]);

module.exports = {
  name: `version`,
  description: `Shows program version`,
  execute() {
    console.log(`v${major}.${minor}.${patch}`);
  }
};
