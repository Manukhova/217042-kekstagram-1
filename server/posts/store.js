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

const setupAuthCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`auth`);
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

  async updateClient(clientId, updateObject) {
    return (await this.collection).updateOne(
        {clientId},
        {$set: updateObject}
    );
  }

}

class CompaniesStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getCompanies(companyId) {
    return (await this.collection).findOne({companyId});
  }

  async getCompaniesByName(companyName) {
    return (await this.collection).findOne({companyName});
  }

  async getAllCompanies() {
    return (await this.collection).find();
  }

  async save(companyData) {
    return (await this.collection).insertOne(companyData);
  }

  async updateCompany(companyId, updateObject) {
    return (await this.collection).updateOne(
        {companyId},
        {$set: updateObject}
    );
  }

  async updateCompanyByName(companyName, updateObject) {
    return (await this.collection).updateOne(
        {companyName},
        {$set: updateObject}
    );
  }
}

class AuthStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getUserByEmail(email) {
    return (await this.collection).findOne({email});
  }

  async addToken(token, email) {
    return (await this.collection).updateOne(
      {email},
      {$set: {token}}
    );
  }

  async getToken(token) {
    return (await this.collection).findOne({token});
  }

  async saveUser(data) {
    return (await this.collection).insertOne(data);
  }

  async update(companyId, updateObject) {
    return (await this.collection).updateOne(
      {companyId},
      {$set: updateObject}
    );
  }
}

module.exports = {
  clientsStore: new ClientsStore(setupClientsCollection().catch((e) => logger.error(`Failed to set up "clients"-collection`, e))),
  companiesStore: new CompaniesStore(setupCompaniesCollection().catch((e) => logger.error(`Failed to set up "companies"-collection`, e))),
  authStore: new AuthStore(setupAuthCollection().catch((e) => logger.error(`Failed to set up "auth"-collection`, e)))
};
