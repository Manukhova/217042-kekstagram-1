const server = require(`../../server/server`);

module.exports = {
  name: `server`,
  description: `Starts the server`,
  execute() {
    server.run();
  }
};
