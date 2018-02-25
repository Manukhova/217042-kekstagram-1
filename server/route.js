const {Router} = require(`express`);
const bodyParser = require(`body-parser`);
const multer = require(`multer`);

const postSchema = require(`./validation`);
const {validateSchema} = require(`./validator`);
const generateData = require(`../src/generate`).generateData;

const async = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const postsRouter = new Router();

postsRouter.use(bodyParser.json());

const upload = multer({storage: multer.memoryStorage()});

const posts = generateData(25);

const toPage = (data, skip = 0, limit = 20) => {
  return {
    data: data.slice(skip, skip + limit),
    skip,
    limit,
    total: data.length
  };
};

postsRouter.get(``, async(async (req, res) => res.send(toPage(posts))));

postsRouter.get(`/:date`, (req, res) => {
  const date = req.params[`date`].split(`:`)[1];
  const post = posts.find((it) => it.date.toString() === date);
  if (!post) {
    res.status(404).end();
  } else {
    res.send(post);
  }
});

postsRouter.post(``, upload.single(`filename`), (req, res) => {
  const data = req.body;
  const errors = validateSchema(data, postSchema);
  console.log(errors);
  if (errors.length > 0) {
    throw new Error(errors);
  }
  res.send(data);
});

postsRouter.use((exception, req, res, next) => {
  let data = exception;
  if (exception instanceof Error) {
    data = exception.errors;
  }
  res.status(400).send(data);
  next();
});

module.exports = postsRouter;
