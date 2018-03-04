const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;

module.exports = MongoClient.connect(url).then((client) => client.db(`kekstagram`)).catch((e) => {
  console.error(`Failed to connect to MongoDB`, e);
  process.exit(1);
});
