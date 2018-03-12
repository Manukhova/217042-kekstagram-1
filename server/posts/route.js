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

const postsRouter = new Router();

postsRouter.use(bodyParser.json());

postsRouter.use((req, res, next) => {
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

postsRouter.get(``, async(async (req, res) => {
  let limit = req.query.limit ? Number(req.query.limit) : DEFAULT_LIMIT;
  let skip = req.query.skip ? Number(req.query.skip) : DEFAULT_SKIP;

  res.send(await toPage(await postsRouter.postStore.getAllPosts(), skip, limit));
}));

postsRouter.get(`/:date`, async(async (req, res) => {
  const date = Number(req.params[`date`]);

  const post = await postsRouter.postStore.getPost(date);
  if (!post) {
    throw new NotFoundError(`Post with date "${date}" not found`);
  } else {
    res.send(post);
  }
}));

postsRouter.get(`/:date/image`, async(async (req, res) => {
  const date = Number(req.params[`date`]);

  const post = await postsRouter.postStore.getPost(date);

  if (!post) {
    throw new NotFoundError(`Post with date "${date}" not found`);
  }

  const image = post.filename;

  if (!image) {
    throw new NotFoundError(`Post with date "${date}" didn't upload image`);
  }

  const {info, stream} = await postsRouter.imageStore.get(image.path);

  if (!info) {
    throw new NotFoundError(`File was not found`);
  }

  res.set(`content-type`, image.mimetype);
  res.set(`content-length`, info.length);
  res.status(200);
  stream.pipe(res);
}));

postsRouter.post(``, upload.single(`filename`), async(async (req, res) => {
  const data = req.body;
  const image = req.file || data.filename;
  data.likes = Number(data.likes);
  data.scale = Number(data.scale);
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
      path: `/api/posts/${data.date}/image`,
      mimetype: image.mimetype
    };
    await postsRouter.imageStore.save(imageInfo.path, createStreamFromBuffer(image.buffer));
    data.filename = imageInfo;
  }

  await postsRouter.postStore.save(data);
  dataRenderer.renderDataSuccess(req, res, data);
}));

postsRouter.use((exception, req, res, next) => {
  dataRenderer.renderException(req, res, exception);
  next();
});

module.exports = (postStore, imageStore) => {
  postsRouter.postStore = postStore;
  postsRouter.imageStore = imageStore;
  return postsRouter;
};
