const server = require(`../server`);

const hostname = `127.0.0.1`;
const PORT_ADRESS = 3000;
const args = process.argv.slice(2);
const port = args[1] ? args[1] : PORT_ADRESS;

module.exports = {
  name: `server`,
  description: `Starts the server`,
  execute() {
      server.listen(port, hostname, (e) => {
        if (e) {
          return console.error(e);
        }
        return console.log(`Server runs at ${hostname}:${port}`);
      });
  }
};
