const http = require(`http`);
const fs = require(`fs`);
const url = require(`url`);
const path = require(`path`);
const {promisify} = require(`util`);

const readfile = promisify(fs.readFile);

const hostname = `127.0.0.1`;

const types = {
  '.css': `text/css`,
  '.html': `text/html; charset=UTF-8`,
  '.jpg': `image/jpeg`,
  '.png': `image/png`,
  '.ico': `image/x-icon`
};

const readFile = async (absolutePath, res) => {

  const data = await readfile(absolutePath);

  const contentType = types[path.extname(absolutePath)];

  if (contentType) {
    res.setHeader(`Content-Type`, contentType);
    res.writeHead(200, `OK`);
    res.end(data);
  }
};

const server = http.createServer((req, res) => {
  let absolutePath = __dirname + `/static` + url.parse(req.url).pathname;

  (async () => {
    try {
      if (req.url === `/`) {
        absolutePath = __dirname + `/static/index.html`;
      }
      await readFile(absolutePath, res);
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
    server.listen(port, hostname, (e) => {
      if (e) {
        return console.error(e);
      }
      return console.log(`Server runs at ${hostname}:${port}`);
    });
  }
};
