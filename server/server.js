const express = require(`express`);

const {clientsStore, companiesStore, authStore} = require(`./posts/store`);
const imageStore = require(`./util/image-store`);
const {clientsRouter, companiesRouter, authRouter} = require(`./posts/route`)(clientsStore, companiesStore, imageStore, authStore);
const logger = require(`./logger`);

const app = express();
app.use(express.static(`static`));

app.use(`/api/client`, clientsRouter);
app.use(`/api/company`, companiesRouter);
app.use(`/api/auth`, authRouter);

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
