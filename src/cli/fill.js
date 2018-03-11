const db = require(`../database/database`);
const generateData = require(`./generate`).generateData;
const logger = require(`../../server/logger`);

const posts = generateData(10);

const loadData = async () => {
  const dBase = await db;
  const collection = dBase.collection(`posts`);
  collection.insert(posts);
  return collection;
};

module.exports = {
  name: `fill`,
  description: `Fills database with test data`,
  execute() {
    loadData().catch((e) => logger.error(`Failed to load test data`, e));
    console.log(`База данных заполнена тестовыми данными.`);
  }
};
