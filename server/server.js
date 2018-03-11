const express = require(`express`);

const postStore = require(`./posts/store`);
const imageStore = require(`./util/image-store`);
const postsRouter = require(`./posts/route`)(postStore, imageStore);
const logger = require(`./logger`);

const app = express();
app.use(express.static(`static`));

app.use(`/api/posts`, postsRouter);

const HOSTNAME = process.env.SERVER_HOST || `localhost`;

module.exports = {
  run(port) {
    const PORT = Number(process.env.SERVER_PORT) || port || 3000;
    app.listen(PORT, HOSTNAME, (e) => {
      if (e) {
        logger.error(`Server start error`, e);
      }
      return logger.info(`Server runs at http://${HOSTNAME}:${PORT}`);
    });
  },
  app
};
