const colors = require(`colors`);
const version = require(`./version`);
const author = require(`./author`);
const license = require(`./license`);
const description = require(`./description`);

module.exports = {
  name: `help`,
  description: `Shows available commands`,
  execute() {
    console.log(`Доступные команды:
      --${colors.gray(this.name)}        — ${colors.green(this.description)};
      --${colors.gray(version.name)}     — ${colors.green(version.description)};
      --${colors.gray(license.name)}     — ${colors.green(license.description)};
      --${colors.gray(author.name)}      — ${colors.green(author.description)};
      --${colors.gray(description.name)} — ${colors.green(description.description)}`);
  }
};
