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

const question = util.promisify(rl.question);

const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

const generateData = (amount) => {
  const generatedData = [];
  for (let i = 0; i < amount; i++) {
    const newEntity = generateEntity();
    generatedData.push(newEntity);
  }
  return generatedData;
};

const checkFilePathCallback = (filePathAnswer, elementsAmountAnswer) => {
  return open(filePathAnswer, `wx`, (filePathErr) => {
    if (filePathErr) {
      if (filePathErr.code === `EEXIST`) {
        return question(`Такой файл уже существует, нужно ли его перезаписать? (yes/no): `, (shouldRewriteAnswer) => {
          if (shouldRewriteAnswer !== `yes`) {
            console.log(`Файл не перезаписан`);
            process.exit(0);
          }
          return writeFile(filePathAnswer, JSON.stringify(generateData(elementsAmountAnswer)), fileWriteOptions);
          rl.close();
        });
      }
    } else {
      return writeFile(filePathAnswer, JSON.stringify(generateData(elementsAmountAnswer)), fileWriteOptions);
    }
  });
};

const noCommandObject = {
  name: `undefined`,
  description: `Shows program purpose`,
  execute() {
    return question(`Привет пользователь! Сгенерируем данные? (yes/no): `, (genDataAnswer) => {
      switch (genDataAnswer) {
        case `yes`:
          return question(`Cколько элементов нужно создать? `, (elementsAmountAnswer) => {
            return question(`Укажите путь до файла, в котором нужно сохранить данные: `, (filePathAnswer) => {
              checkFilePathCallback(filePathAnswer, elementsAmountAnswer);
            });
          });
          break;
        default:
          console.log(`Пока!`);
          process.exit(0);
      }
    });
  }
};

module.exports = {
  noCommandObject,
  callback: checkFilePathCallback
};
