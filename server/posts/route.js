const {Router} = require(`express`);
const {validateSchema} = require(`../util/validator`);
const postSchema = require(`./validation`);
const dataRenderer = require(`../util/data-renderer`);
const ValidationError = require(`../error/validation-error`);
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

clientsRouter.use(bodyParser.json());
companiesRouter.use(bodyParser.json());

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
  data.clientId = Number(data.clientId);
  data.roomsNumber = Number(data.roomsNumber);
  data.flatSquare = Number(data.flatSquare);
  data.date = data.date || Number(new Date());
  logger.info(`Received data from user: `, data);

  if (image) {
    data.filename = image;
  }

  const errors = validateSchema(data, postSchema);

  if (errors.length > 0) {
    throw new ValidationError(errors);
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

companiesRouter.post(``, upload.single(`filename`), async(async (req, res) => {
  const data = req.body;
  data.companyId = Number(data.companyId);
  data.date = data.date || Number(new Date());
  logger.info(`Received data from user: `, data);

  await companiesRouter.companiesStore.save(data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

clientsRouter.use((exception, req, res, next) => {
  dataRenderer.renderException(req, res, exception);
  next();
});

module.exports = (clientsStore, companiesStore, imageStore) => {
  clientsRouter.clientsStore = clientsStore;
  clientsRouter.imageStore = imageStore;
  companiesRouter.companiesStore = companiesStore;
  return {
    companiesRouter,
    clientsRouter
  };
};
