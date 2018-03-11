const server = require(`../../server/server`);

const args = process.argv.slice(2);
const port = args[1];

module.exports = {
  name: `server`,
  description: `Starts the server`,
  execute() {
    server.run(port);
  }
};
