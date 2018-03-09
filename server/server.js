const express = require(`express`);

const postStore = require(`./posts/store`);
const imageStore = require(`./util/image-store`);
const postsRouter = require(`./posts/route`)(postStore, imageStore);
const logger = require(`./logger`);

const app = express();
app.use(express.static(`static`));

app.use(`/api/posts`, postsRouter);

const HOSTNAME = process.env.SERVER_HOST || `localhost`;
const PORT = parseInt(process.env.SERVER_PORT, 10) || 3000;

module.exports = {
  run() {
    app.listen(PORT, HOSTNAME, (e) => {
      if (e) {
        return logger.error(e);
      }
      return logger.info(`Server runs at http://${HOSTNAME}:${PORT}`);
    });
  },
  app
};
