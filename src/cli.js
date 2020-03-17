const serverCommand = require(`./cli/server-command`);

const args = process.argv.slice(2);

let map = new Map();

map.set(`--${serverCommand.name}`, serverCommand)

if (map.has(args[0])) {
  map.get(args[0]).execute();
}
