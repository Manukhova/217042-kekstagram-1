const express = require(`express`);
const postsRouter = require(`./posts/route`);

const app = express();
app.use(express.static(`static`));

app.use(`/api/posts`, postsRouter);

const hostname = `127.0.0.1`;

module.exports = {
  run(port) {
    app.listen(port, hostname, (e) => {
      if (e) {
        return console.error(e);
      }
      return console.log(`Server runs at ${hostname}:${port}`);
    });
  },
  app
};
