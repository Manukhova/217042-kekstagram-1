const colors = require(`colors`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `license`,
  description: `Shows license`,
  execute() {
    console.log(`Лицензия: ${colors.inverse(packageInfo.license)}`);
  }
};
