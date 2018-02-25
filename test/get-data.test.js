const request = require(`supertest`);
const assert = require(`assert`);
const {app} = require(`../server/server`);

describe(`GET api/posts`, function () {

  it(`respond with json`, () => {
    return request(app)
        .get(`/api/posts`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/)
        .then((response) => {
          const page = response.body;
          assert.equal(page.total, 25);
          assert.equal(page.data.length, 20);
          assert.equal(Object.keys(page.data[0]).length, 8);
        });
  });

  // it(`find post by date ???`, () => {
  //   return request(app)
  //       .get(`/api/posts/:2770493939061`)
  //       .expect(200)
  //       .expect(`Content-Type`, /json/)
  //       .then((response) => {
  //         const post = response.body;
  //         assert.equal(post.date, `2770493939061`);
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
