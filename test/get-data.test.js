const request = require(`supertest`);
// const assert = require(`assert`);
const mockPostsRouter = require(`./mock-posts-router`);
const app = require(`express`)();

app.use(`/api/posts`, mockPostsRouter);

describe(`GET /api/posts`, function () {

  it(`respond with json`, () => {
    return request(app)
        .get(`/api/posts`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);
  });

  // it(`find post by date`, () => {
  //   return request(app)
  //       .get(`/api/posts/${date}`)
  //       .expect(200)
  //       .expect(`Content-Type`, /json/)
  //       .then((response) => {
  //         const post = response.body;
  //         assert.equal(post.date, `${date}`);
  //       });
  // });

  it(`unknown address should respond with 404`, () => {
    return request(app)
        .get(`/api/poaaa`)
        .set(`Accept`, `application/json`)
        .expect(404)
        .expect(`Content-Type`, /html/);
  });
});
