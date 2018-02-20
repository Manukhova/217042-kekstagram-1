const checkFilePathCallback = require(`../src/generate`).checkFilePathCallback;
const writeFileCallback = require(`../src/generate`).writeFileCallback;
const rewriteFile = require(`../src/generate`).rewriteFile;

const fs = require(`fs`);
const {promisify} = require(`util`);
const access = promisify(fs.access);
const unlink = promisify(fs.unlink);
const stat = promisify(fs.stat);
const assert = require(`assert`);

describe(`Check path folder`, function () {
  it(`should fail on not existing folder`, function () {
    const tempFileName = `${__dirname}/folder/testfile.json`;
    return checkFilePathCallback(tempFileName).then(() => {
      assert.fail(`Path ${tempFileName} should not be available`);
    }).catch((e) => assert.ok(e));
  });

  it(`should create new non empty file`, function () {
    const tempFileName = `${__dirname}/testfile.json`;
    return writeFileCallback(tempFileName, 5)
        .then(() => access(tempFileName))
        .then(() => stat(tempFileName))
        .then((stats) => assert.ok(stats.size > 2))
        .then(() => unlink(tempFileName));
  });

  it(`should rewrite file`, function () {
    const tempFileName = `${__dirname}/testfile.json`;
    return rewriteFile(`yes`, tempFileName)
        .then(() => access(tempFileName))
        .then(() => unlink(tempFileName));
  });

  it(`should create new file with empty array`, function () {
    const tempFileName = `${__dirname}/testfile.json`;
    return writeFileCallback(tempFileName, `five`)
        .then(() => access(tempFileName))
        .then(() => stat(tempFileName))
        .then((stats) => assert.equal(stats.size, 2))
        .then(() => unlink(tempFileName));
  });

});
