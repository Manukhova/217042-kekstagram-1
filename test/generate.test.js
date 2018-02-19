const checkFilePathCallback = require(`../src/generate`).checkFilePathCallback;
const writeFileCallback = require(`../src/generate`).writeFileCallback;
const rewriteFile = require(`../src/generate`).rewriteFile;

const fs = require(`fs`);
const {promisify} = require(`util`);
const access = promisify(fs.access);
const unlink = promisify(fs.unlink);
const assert = require(`assert`);

describe(`Check path folder`, function () {
  it(`should fail on not existing folder`, function () {
    const tempFileName = `${__dirname}/folder/testfile.json`;
    return checkFilePathCallback(tempFileName).then(() => {
      assert.fail(`Path ${tempFileName} should not be available`);
    }).catch((e) => assert.ok(e));
  });
});

describe(`Create new file`, function () {
  it(`should create new file`, function () {
    const tempFileName = `${__dirname}/testfile.json`;
    return writeFileCallback(tempFileName)
        .then(() => access(tempFileName))
        .then(() => unlink(tempFileName));
  });
});

describe(`Rewrite file`, function () {
  it(`should rewrite file`, function () {
    const tempFileName = `${__dirname}/testfile.json`;
    return rewriteFile(`yes`, tempFileName)
        .then(() => access(tempFileName))
        .then(() => unlink(tempFileName));
  });
});
