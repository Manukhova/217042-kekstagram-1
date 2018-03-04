const request = require(`supertest`);
const mockPostsRouter = require(`./mock-posts-router`);
const app = require(`express`)();

app.use(`/api/posts`, mockPostsRouter);

describe(`POST /api/posts`, function () {

  it(`should consume JSON`, () => {
    return request(app).post(`/api/posts`).
        send({
          comments: [`вф вёфягбъялющс зчл`, `кйёя`, `лъупзелжо аилюкжу`, `йядмнгемоеъкъ`, ` ыёдсш`, `ее м `, `е ытсп`],
          date: 1927170795198,
          effect: `heat`,
          hashtags: [`#ёз`, `#`, `#п`, `#ёйяъфт`, `#сзуяё`],
          likes: 582,
          scale: 40,
          url: `https://picsum.photos/600/?random`,
          filename: {
            mimetype: `image/png`
          }
        }).
        expect(200, {
          comments: [`вф вёфягбъялющс зчл`, `кйёя`, `лъупзелжо аилюкжу`, `йядмнгемоеъкъ`, ` ыёдсш`, `ее м `, `е ытсп`],
          date: 1927170795198,
          effect: `heat`,
          hashtags: [`#ёз`, `#`, `#п`, `#ёйяъфт`, `#сзуяё`],
          likes: 582,
          scale: 40,
          url: `https://picsum.photos/600/?random`,
          filename: {
            mimetype: `image/png`
          }
        });
  });

  it(`should consume form-data`, () => {
    return request(app).post(`/api/posts`).
        field(`effect`, `chrome`).
        field(`likes`, 152).
        field(`scale`, 78).
        field(`url`, `https://picsum.photos/600/?random`).
        attach(`filename`, `test/fixtures/image.png`).
        expect(200, {
          effect: `chrome`,
          likes: 152,
          scale: 78,
          url: `https://picsum.photos/600/?random`,
          filename: {
            mimetype: `image/png`
          }
        });
  });

  it(`should fail if scale is invalid`, () => {
    return request(app).post(`/api/posts`).
        field(`effect`, `sepia`).
        field(`scale`, 15000).
        field(`likes`, 400).
        attach(`filename`, `test/fixtures/image.png`).
        expect(400, [{
          fieldName: `scale`,
          fieldValue: `15000`,
          errorMessage: `should be in range 0..100`
        }]);
  });

});
