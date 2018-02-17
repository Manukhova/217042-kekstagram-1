const assert = require(`assert`);
const generateEntity = require(`../generate-entity`);

const generateEntityData = generateEntity();

describe(`generateEntity`, () => {
  it(`should have proper key types`, () => {
    assert.equal(typeof generateEntity, `function`);
    assert.equal(typeof generateEntityData, `object`);
    assert.equal(typeof generateEntityData.url, `string`);
    assert.equal(typeof generateEntityData.scale, `number`);
    assert.equal(typeof generateEntityData.hashtags, `object`);
    assert.equal(typeof generateEntityData.description, `string`);
    assert.equal(typeof generateEntityData.likes, `number`);
    assert.equal(typeof generateEntityData.comments, `object`);
  });

  it(`should have proper value of scale key`, () => {
    assert.ok(generateEntityData.scale >= 0);
  });

  it(`should have proper effect key`, () => {
    const effectArray = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
    assert.ok(effectArray.indexOf(generateEntityData.effect) >= 0);
  });

  it(`should have proper hashtag key`, () => {
    assert.ok(generateEntityData.hashtags.length <= 5);
  });

  it(`should have unique hashtags key`, () => {
    const filteredArray = generateEntityData.hashtags.filter((value, index, arr) => {
      return arr.indexOf(value) === index;
    });
    assert.equal(filteredArray.length, generateEntityData.hashtags.length);
  });

  it(`should have proper shape of hashtags key`, () => {
    generateEntityData.hashtags.forEach((item) => {
      assert.ok(item.includes(`#`));
      assert.equal(item.includes(` `), false);
      assert.ok(item.length <= 20);
    });
  });

  it(`should have proper length of description key`, () => {
    assert.ok(generateEntityData.description.length <= 140);
  });

  it(`should have proper value of likes key`, () => {
    assert.ok(generateEntityData.likes >= 0 && generateEntityData.likes <= 1000);
  });

  it(`should have proper length of comment key`, () => {
    generateEntityData.comments.forEach((item) => {
      assert.ok(item.length <= 140);
    });
  });
});
