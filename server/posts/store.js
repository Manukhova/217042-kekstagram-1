const db = require(`../../src/database/database`);
const logger = require(`../logger`);

const setupClientsCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`clients`);
  collection.createIndex({date: -1}, {unique: true});
  return collection;
};

const setupCompaniesCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`companies`);
  collection.createIndex({date: -1}, {unique: true});
  return collection;
};

class ClientsStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getClient(clientId) {
    return (await this.collection).findOne({clientId});
  }

  async getAllClients() {
    return (await this.collection).find();
  }

  async save(clientData) {
    return (await this.collection).insertOne(clientData);
  }

}

class CompaniesStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getCompanies(companyId) {
    return (await this.collection).findOne({companyId});
  }

  async getAllCompanies() {
    return (await this.collection).find();
  }

  async save(companyData) {
    return (await this.collection).insertOne(companyData);
  }

}

module.exports = {
  clientsStore: new ClientsStore(setupClientsCollection().catch((e) => logger.error(`Failed to set up "clients"-collection`, e))),
  companiesStore: new CompaniesStore(setupCompaniesCollection().catch((e) => logger.error(`Failed to set up "companies"-collection`, e)))
}
