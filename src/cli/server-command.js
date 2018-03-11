const server = require(`../../server/server`);

const PORT_ADRESS = 3000;
const args = process.argv.slice(2);
const port = args[1] ? args[1] : PORT_ADRESS;

module.exports = {
  name: `server`,
  description: `Starts the server`,
  execute() {
    server.run(port);
  }
};
