const assert = require(`assert`);
const generateEntity = require(`../generate-entity`);

describe(`generateEntity`, () => {
  describe(`module generateEntity`, () => {
    it(`should have proper key types`, () => {
      assert.equal(typeof generateEntity, `function`);
      assert.equal(typeof generateEntity(), `object`);
      assert.equal(typeof generateEntity().url, `string`);
      assert.equal(typeof generateEntity().scale, `number`);
      assert.equal(typeof generateEntity().hashtags, `object`);
      assert.equal(typeof generateEntity().description, `string`);
      assert.equal(typeof generateEntity().likes, `number`);
      assert.equal(typeof generateEntity().comments, `object`);
    });

    it(`should have proper value of scale key`, () => {
      assert.ok(generateEntity().scale >= 0);
    });

    it(`should have proper effect key`, () => {
      const effectArray = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
      assert.ok(effectArray.indexOf(generateEntity().effect) >= 0);
    });

    it(`should have proper hashtag key`, () => {
      assert.ok(generateEntity().hashtags.length <= 5);
    });

    it(`should have proper length of description key`, () => {
      assert.ok(generateEntity().description.length <= 140);
    });

    it(`should have proper value of likes key`, () => {
      assert.ok(generateEntity().likes >= 0 && generateEntity().likes <= 1000);
    });
  });
});

describe(`generateEntity2`, () => {
  it(`should have unique hashtags key`, () => {
    const filteredArray = generateEntity().hashtags.filter((value, index, arr) => {
      return arr.indexOf(value) === index;
    });
    assert.equal(filteredArray.length, generateEntity().hashtags.length);
  });
});

describe(`generateEntity3`, () => {
  it(`should have proper length of comment key`, () => {
    generateEntity().comments.forEach((item) => {
      assert.ok(item.length <= 140);
    });
  });
});

describe(`generateEntity4`, () => {
  it(`should have proper shape of hashtags key`, () => {
    generateEntity().hashtags.forEach((item) => {
      assert.ok(item.includes(`#`));
      assert.equal(item.includes(` `), false);
      assert.ok(item.length <= 20);
    });
  });
});
