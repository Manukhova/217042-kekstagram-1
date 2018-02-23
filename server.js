const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
const {promisify} = require(`util`);

const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);

const hostname = `127.0.0.1`;
const portAdress = 3000;

const types = {
    css: `text/css`,
    html: `text/html; charset=UTF-8`,
    jpg: `image/jpeg`,
    ico: `image/x-icon`
};

const readFile = async (path, res) => {
    const data = await readfile(path);
    res.setHeader(`content-type`, types.html);
    res.setHeader(`content-length`, Buffer.byteLength(data));
    res.end(data);
};

const server = http.createServer((req, res) => {
  const absolutePath = url.parse(req.url).pathname;

  (async () => {
    try {
      switch (absolutePath) {
        case `/`:
          const newPath = __dirname + `/static/index.html`;
          console.log(newPath);
          const pathStat = await stat(newPath);
          console.log(pathStat);
          res.statusCode = 200;
          res.statusMessage = `OK`;

          await readFile(newPath, res);

          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
      res.writeHead(404, `Not Found`);
      res.end();
    }
  })().catch((e) => {
    res.writeHead(500, e.message, {
      'content-type': `text/plain`
    });
    res.end(e.message);
  });
});

module.exports = {
  run(port) {
    if (!port) {
      port = portAdress;
    }
    server.listen(port, hostname, (e) => {
      if (e) {
        return console.error(e);
      }
      console.log(`Server runs at ${hostname}:${port}`);
    });
  }
};
