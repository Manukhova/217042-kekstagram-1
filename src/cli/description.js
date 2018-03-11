const colors = require(`colors`);
const packageInfo = require(`../../package.json`);

module.exports = {
  name: `description`,
  description: `Shows description`,
  execute() {
    console.log(`Описание: ${colors.white.underline(packageInfo.description)}`);
  }
};
