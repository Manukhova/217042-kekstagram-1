const createPostsRouter = require(`../server/posts/route`);
const generateData = require(`../src/cli/generate`).generateData;

const posts = generateData(10);

class Cursor {
  constructor(data) {
    this.data = data;
  }

  skip(count) {
    return new Cursor(this.data.slice(count));
  }

  limit(count) {
    return new Cursor(this.data.slice(0, count));
  }

  async count() {
    return this.data.length;
  }

  async toArray() {
    return this.data;
  }
}

class MockPostStore {
  constructor() {
  }

  async getPost(date) {
    return posts.find((it) => it.date === date);
  }

  async getAllPosts() {
    return new Cursor(posts);
  }

  async save() {
  }

}

class MockImageStore {

  async getBucket() {
  }

  async get() {
  }

  async save() {
  }

}

module.exports = createPostsRouter(new MockPostStore(), new MockImageStore());
