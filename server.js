const http = require(`http`);
const fs = require(`fs`);
const path = require(`path`);
const {promisify} = require(`util`);

const stat = promisify(fs.stat);
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

  const headers = {};

  const splitedPathArr = absolutePath.split(`/`);
  const contentType = types[path.extname(splitedPathArr[splitedPathArr.length - 1])];

  if (contentType) {
    headers[`Content-Type`] = contentType;
    res.writeHead(200, headers);
    res.end(data);
  }
};

const server = http.createServer((req, res) => {
  let absolutePath;

  (async () => {
    try {
      if (req.url === `/`) {
        absolutePath = __dirname + `/static/index.html`;

        await stat(absolutePath);
        await readFile(absolutePath, res);

      } else {
        absolutePath = __dirname + `/static` + req.url;

        await stat(absolutePath);
        await readFile(absolutePath, res);
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
    server.listen(port, hostname, (e) => {
      if (e) {
        return console.error(e);
      }
      return console.log(`Server runs at ${hostname}:${port}`);
    });
  }
};
