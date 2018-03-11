const readline = require(`readline`);
const fs = require(`fs`);
const generateEntity = require(`../generate-entity`);
const util = require(`util`);
const writeFile = util.promisify(fs.writeFile);
const open = util.promisify(fs.open);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question[util.promisify.custom] = (arg) => {
  return new Promise((resolve) => {
    rl.question(arg, resolve);
  });
};
const question = util.promisify(rl.question);

const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

const state = {};
const setState = (key, value) => {
  state[key] = value;
  return state;
};

const generateData = (amountVal) => {
  const generatedData = [];
  for (let i = 0; i < amountVal; i++) {
    const newEntity = generateEntity();
    generatedData.push(newEntity);
  }
  return generatedData;
};

const writeFileCallback = (filePathAnswer, amount) => {
  return writeFile(filePathAnswer, JSON.stringify(generateData(amount)), fileWriteOptions)
      .then(() => {
        console.log(`Файл записан`);
      });
};

const rewriteFile = (shouldRewriteAnswer, filePathAnswer, amount) => {
  if (shouldRewriteAnswer !== `yes`) {
    console.log(`Файл не перезаписан`);
    return false;
  } else {
    return writeFile(filePathAnswer, JSON.stringify(generateData(amount)), fileWriteOptions)
        .then(() => {
          console.log(`Файл перезаписан`);
          rl.close();
        });
  }
};

const failErrorCallback = (filePathErr) => {
  if (filePathErr.code === `EEXIST`) {
    return question(`Такой файл уже существует, нужно ли его перезаписать? (yes/no): `)
        .then((shouldRewriteAnswer) =>
          rewriteFile(shouldRewriteAnswer, state.path, state.amount));
  }
  if (filePathErr.message === `Cancel generate`) {
    console.log(`Пока!`);
  }
  return false;
};

const checkFilePathCallback = (path) => {
  setState(`path`, path);
  return open(path, `wx`)
      .then(() => writeFileCallback(path, state.amount));
};

const generateAnswer = (genDataAnswer) => {
  genDataAnswer = genDataAnswer.trim();
  if (genDataAnswer === `yes`) {
    return question(`Cколько элементов нужно создать? `);
  }
  throw new Error(`Cancel generate`);
};

const amountAnswer = (elementsAmountAnswer) => {
  setState(`amount`, elementsAmountAnswer);
  return question(`Укажите путь до файла, в котором нужно сохранить данные: `);
};

module.exports = {
  name: `undefined`,
  description: `Generate data`,
  execute() {
    question(`Привет пользователь! Сгенерируем данные? (yes/no): `)
        .then(generateAnswer)
        .then(amountAnswer)
        .then(checkFilePathCallback)
        .catch(failErrorCallback);
  },
  generateData,
  checkFilePathCallback,
  rewriteFile,
  writeFileCallback
};
