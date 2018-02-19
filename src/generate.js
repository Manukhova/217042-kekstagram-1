const readline = require(`readline`);
const fs = require(`fs`);
const generateEntity = require(`./generate-entity`);
const util = require(`util`);
const writeFile = util.promisify(fs.writeFile);
const open = util.promisify(fs.open);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = util.promisify(function (quest, callback) {
  rl.question(quest, callback.bind(null, null));
});

const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

let amount;

const generateData = (amountVal) => {
  const generatedData = [];
  for (let i = 0; i < amountVal; i++) {
    const newEntity = generateEntity();
    generatedData.push(newEntity);
  }
  return generatedData;
};

const writeFileCallback = (filePathAnswer) => {
  return writeFile(filePathAnswer, JSON.stringify(generateData(amount)), fileWriteOptions)
      .then(() => {
        console.log(`Файл записан`);
        process.exit(0);
      });
};

const rewriteFile = (shouldRewriteAnswer, filePathAnswer) => {
  if (shouldRewriteAnswer !== `yes`) {
    console.log(`Файл не перезаписан`);
    process.exit(0);
  }
  return writeFile(filePathAnswer, JSON.stringify(generateData(amount)), fileWriteOptions)
      .then(() => {
        console.log(`Файл перезаписан`);
        rl.close();
      });
};

const failErorCallback = (filePathErr, filePathAnswer) => {
  if (filePathErr) {
    if (filePathErr.code === `EEXIST`) {
      return question(`Такой файл уже существует, нужно ли его перезаписать? (yes/no): `)
          .then((shouldRewriteAnswer) => rewriteFile(shouldRewriteAnswer, filePathAnswer))
          .catch((e) => console.error(e));
    }
  }
};

const checkFilePathCallback = (path) => {
  return open(path, `wx`)
      .then((path) => writeFileCallback(path))
      .catch((e) => failErorCallback(e, path));
};

const generateAnswer = (genDataAnswer) => {
  switch (genDataAnswer) {
    case `yes`:
      return question(`Cколько элементов нужно создать? `)
          .catch((e) => console.error(e));
    default:
      console.log(`Пока!`);
      process.exit(0);
  }
};

const amountAnswer = (elementsAmountAnswer) => {
  amount = elementsAmountAnswer;
  return question(`Укажите путь до файла, в котором нужно сохранить данные: `);
};

const pathAnswer = (filePathAnswer) => {
  checkFilePathCallback(filePathAnswer, amount);
};

const noCommandObject = {
  name: `undefined`,
  description: `Generate data`,
  execute() {
    question(`Привет пользователь! Сгенерируем данные? (yes/no): `)
        .then(generateAnswer)
        .then(amountAnswer)
        .then(pathAnswer)
        .catch((e) => console.error(e));
  }
};

module.exports = {
  noCommandObject,
  checkFilePathCallback,
  generateAnswer,
  rewriteFile,
  writeFileCallback
};
