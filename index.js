const version = require(`./src/version`);
const help = require(`./src/help`);
const noCommand = require(`./src/nocommand`);
const byDefault = require(`./src/default`);

const args = process.argv.slice(2);

let map = new Map();

map
    .set(`--version`, version)
    .set(`--help`, help)
    .set(void 0, noCommand)
    .set(`default`, byDefault);

if (map.has(args[0])) {
  map.get(args[0]).execute();
} else {
  map.get(`default`).execute();
}
