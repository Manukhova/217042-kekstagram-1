const version = require(`./cli/version`);
const help = require(`./cli/help`);
const generate = require(`./cli/generate`);
const author = require(`./cli/author`);
const license = require(`./cli/license`);
const description = require(`./cli/description`);
const byDefault = require(`./cli/default`);
const serverCommand = require(`./cli/server-command`);

const args = process.argv.slice(2);

let map = new Map();

map
    .set(`--${version.name}`, version)
    .set(`--${help.name}`, help)
    .set(`--${author.name}`, author)
    .set(`--${license.name}`, license)
    .set(`--${description.name}`, description)
    .set(`--${serverCommand.name}`, serverCommand)
    .set(void 0, generate);

if (map.has(args[0])) {
  map.get(args[0]).execute();
} else {
  byDefault.execute();
}
