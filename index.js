const version = require(`./src/version`);
const help = require(`./src/help`);
const generate = require(`./src/generate`);
const author = require(`./src/author`);
const license = require(`./src/license`);
const description = require(`./src/description`);
const byDefault = require(`./src/default`);
const server = require(`./server`);

const args = process.argv.slice(2);

const PORT_ADRESS = 3000;

let map = new Map();

map
    .set(`--${version.name}`, version)
    .set(`--${help.name}`, help)
    .set(`--${author.name}`, author)
    .set(`--${license.name}`, license)
    .set(`--${description.name}`, description)
    .set(void 0, generate);

if (args[0] === `--server`) {
  const port = args[1] ? args[1] : PORT_ADRESS;
  server.run(port);
} else if (map.has(args[0])) {
  map.get(args[0]).execute();
} else {
  byDefault.execute();
}
