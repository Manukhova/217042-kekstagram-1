const {Router} = require(`express`);
const uuid = require('uuid');
const dataRenderer = require(`../util/data-renderer`);
const NotFoundError = require(`../error/not-found-error`);
const createStreamFromBuffer = require(`../util/buffer-to-stream`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);
const logger = require(`../logger`);

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

const async = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const clientsRouter = new Router();
const companiesRouter = new Router();
const authRouter = new Router();

clientsRouter.use(bodyParser.json());
companiesRouter.use(bodyParser.json());
authRouter.use(bodyParser.json());

clientsRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});
companiesRouter.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
});

const upload = multer({storage: multer.memoryStorage()});

const toPage = async (data, skip, limit) => {
  return {
    data: await (data.skip(skip).limit(limit).toArray()),
    skip,
    limit,
    total: await data.count()
  };
};

clientsRouter.get(``, async(async (req, res) => {
  let limit = Number(req.query.limit) || DEFAULT_LIMIT;
  let skip = Number(req.query.skip) || DEFAULT_SKIP;

  res.send(await toPage(await clientsRouter.clientsStore.getAllClients(), skip, limit));
}));

companiesRouter.get(``, async(async (req, res) => {
  let limit = Number(req.query.limit) || DEFAULT_LIMIT;
  let skip = Number(req.query.skip) || DEFAULT_SKIP;

  res.send(await toPage(await companiesRouter.companiesStore.getAllCompanies(), skip, limit));
}));


clientsRouter.get(`/:clientId`, async(async (req, res) => {
  const clientId = Number(req.params[`clientId`]);

  const post = await clientsRouter.clientsStore.getClient(clientId);
  if (!post) {
    throw new NotFoundError(`Post with clientId "${clientId}" not found`);
  } else {
    res.send(post);
  }
}));

companiesRouter.get(`/:companyId`, async(async (req, res) => {
  const companyId = Number(req.params[`companyId`]);

  const company = await companiesRouter.companiesStore.getCompanies(companyId);
  if (!company) {
    throw new NotFoundError(`Post with clientId "${companyId}" not found`);
  } else {
    res.send(company);
  }
}));

companiesRouter.get(`/:companyName`, async(async (req, res) => {
  const companyName = req.params[`companyName`];

  const company = await companiesRouter.companiesStore.getCompaniesByName(companyName);
  if (!company) {
    throw new NotFoundError(`Post with companyName "${companyName}" not found`);
  } else {
    res.send(company);
  }
}));

clientsRouter.get(`/:clientId/image`, async(async (req, res) => {
  const clientId = Number(req.params[`clientId`]);

  const post = await clientsRouter.clientsStore.getClient(clientId);

  if (!post) {
    throw new NotFoundError(`Post with clientId "${clientId}" not found`);
  }

  const image = post.filename;

  if (!image) {
    throw new NotFoundError(`Post with clientId "${clientId}" didn't upload image`);
  }

  const {info, stream} = await clientsRouter.imageStore.get(image.path);

  if (!info) {
    throw new NotFoundError(`File was not found`);
  }

  res.set(`content-type`, image.mimetype);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
}));

clientsRouter.post(``, upload.single(`filename`), async(async (req, res) => {
  const data = req.body;
  const image = req.file || data.filename;
  data.clientId = Number(data.clientId) || null;
  data.roomsNumber = Number(data.roomsNumber) || null;
  data.flatSquare = Number(data.flatSquare) || null;
  data.date = data.date || Number(new Date());
  logger.info(`Received data from user: `, data);

  if (image) {
    data.filename = image;
  }

  if (image) {
    const imageInfo = {
      path: `/api/posts/${data.clientId}/image`,
      mimetype: image.mimetype
    };
    await clientsRouter.imageStore.save(imageInfo.path, createStreamFromBuffer(image.buffer));
    data.filename = imageInfo;
  }

  await clientsRouter.clientsStore.save(data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

clientsRouter.patch(`/:clientId`, upload.none(), async(async (req, res) => {
  const clientId = Number(req.params[`clientId`]);
  const data = req.body;
  data.clientId = Number(clientId);
  data.date = data.date || Number(new Date());
  logger.info(`Received data for update: `, data);

  await clientsRouter.clientsStore.updateClient(data.clientId, data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

companiesRouter.patch(`/:companyId`, upload.none(), async(async (req, res) => {
  const companyId = Number(req.params[`companyId`]);
  const data = req.body;
  data.companyId = Number(companyId);
  data.date = data.date || Number(new Date());
  logger.info(`Received data for update: `, data);

  await companiesRouter.companiesStore.updateCompany(data.companyId, data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

companiesRouter.patch(`/:companyName`, upload.none(), async(async (req, res) => {
  const companyName = req.params[`companyName`];
  const data = req.body;
  data.date = data.date || Number(new Date());
  logger.info(`Received data for update: `, data);

  await companiesRouter.companiesStore.updateCompanyByName(companyName, data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

companiesRouter.post(``, upload.single(`filename`), async(async (req, res) => {
  const data = req.body;
  data.companyId = Number(data.companyId);
  data.date = data.date || Number(new Date());
  logger.info(`Received data from user: `, data);

  await companiesRouter.companiesStore.save(data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

authRouter.post(`/:role/registration`, upload.none(), async(async (req, res) => {
  const email = req.body.email;
  const role = req.params[`role`];
  logger.info(`Received email ${email} for role ${role}`);

  const user = await authRouter.authStore.getUserByEmail(email);

  if (!user) {
    const authData = {
      email,
      role,
      password: req.body.password
    };
    await authRouter.authStore.saveUser(authData);

    const data = req.body;

    if (role === 'client') {
      data.clientId = Number(data.clientId) || null;
      data.roomsNumber = Number(data.roomsNumber) || null;
      data.flatSquare = Number(data.flatSquare) || null;
    }

    if (role === "company") {
      data.companyId = Number(data.companyId);
    }

    data.date = data.date || Number(new Date());

    const { password, ...noPwdData } = data;

    await clientsRouter.clientsStore.save(noPwdData);

    res.send("Success")
  } else {
    throw new Error('Такой пользователь уже есть')
  }
}));

authRouter.post(`/:role/login`, upload.none(), async(async (req, res) => {
  const email = req.body.email;
  const role = req.params[`role`];
  logger.info(`Received email ${email} for role ${role}`);

  const user = await authRouter.authStore.getUserByEmail(email);

  if (user && req.body.password === user.password && role === user.role) {
    res.send("Success")
  } else {
    throw new Error('Неверные данные')
  }
}));

clientsRouter.use((exception, req, res, next) => {
  dataRenderer.renderException(req, res, exception);
  next();
});

companiesRouter.use((exception, req, res, next) => {
  dataRenderer.renderException(req, res, exception);
  next();
});

authRouter.use((exception, req, res, next) => {
  dataRenderer.renderException(req, res, exception);
  next();
});

module.exports = (clientsStore, companiesStore, imageStore, authStore) => {
  clientsRouter.clientsStore = clientsStore;
  clientsRouter.imageStore = imageStore;
  companiesRouter.companiesStore = companiesStore;
  authRouter.authStore = authStore;
  return {
    companiesRouter,
    clientsRouter,
    authRouter
  };
};
