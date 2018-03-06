const request = require(`supertest`);
const assert = require(`assert`);
const mockPostsRouter = require(`./mock-posts-router`);
const app = require(`express`)();

app.use(`/api/posts`, mockPostsRouter);

let date;

describe(`GET /api/posts`, function () {

  it(`respond with json`, () => {
    return request(app)
        .get(`/api/posts`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/)
        .then((response) => {
          const page = response.body;
          date = page.data[0].date;
          assert.equal(page.total, 10);
          assert.equal(page.data.length, 10);
          assert.equal(Object.keys(page.data[0]).length, 8);
        });
  });

  it(`find post by date`, () => {
    return request(app)
        .get(`/api/posts/${date}`)
        .expect(200)
        .expect(`Content-Type`, /json/)
        .then((response) => {
          const post = response.body;
          assert.equal(post.date, `${date}`);
        });
  });

  it(`unknown address should respond with 404`, () => {
    return request(app)
        .get(`/api/poaaa`)
        .set(`Accept`, `application/json`)
        .expect(404)
        .expect(`Content-Type`, /html/);
  });
});
