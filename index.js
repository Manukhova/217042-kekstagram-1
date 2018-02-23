const version = require(`./src/version`);
const help = require(`./src/help`);
const generate = require(`./src/generate`);
const author = require(`./src/author`);
const license = require(`./src/license`);
const description = require(`./src/description`);
const byDefault = require(`./src/default`);
const server = require(`./server`);

const fs = require(`fs`);
const readline = require(`readline`);
const {promisify} = require(`util`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question[promisify.custom] = (arg) => {
  return new Promise((resolve) => {
    rl.question(arg, resolve);
  });
};
const question = promisify(rl.question);

const args = process.argv.slice(2);

let map = new Map();

map
    .set(`--${version.name}`, version)
    .set(`--${help.name}`, help)
    .set(`--${author.name}`, author)
    .set(`--${license.name}`, license)
    .set(`--${description.name}`, description)
    .set(void 0, generate);

if(args[0] === `--server`) {
  question(`Port number: `)
  .then((port) => {
    server.run(port);
  });
} else if (map.has(args[0])) {
  map.get(args[0]).execute();
} else {
  byDefault.execute();
}
