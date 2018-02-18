const readline = require(`readline`);
const fs = require(`fs`);
const generateEntity = require(`./generate-entity`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

let entityAmount;

const generateData = (amount) => {
  const generatedData = [];
  for (let i = 0; i < amount; i++) {
    const newEntity = generateEntity();
    generatedData.push(newEntity);
  }
  return generatedData;
};

const checkFilePathCallback = (filePathAnswer) => {
  const filePath = filePathAnswer;
  fs.open(filePath, `wx`, (filePathErr) => {
    if (filePathErr) {
      if (filePathErr.code === `EEXIST`) {
        rl.question(`Такой файл уже существует, нужно ли его перезаписать? (yes/no): `, (shouldRewriteAnswer) => {
          if (shouldRewriteAnswer !== `yes`) {
            console.log(`Файл не перезаписан`);
            process.exit(0);
          }
          fs.writeFile(filePath, JSON.stringify(generateData(entityAmount)), fileWriteOptions, (rewriteFileErr) => {
            if (rewriteFileErr) {
              throw rewriteFileErr;
            }
            console.log(`Файл перезаписан!`);
            process.exit(0);
          });
          rl.close();
        });
      }
    } else {
      fs.writeFile(filePath, JSON.stringify(generateData(entityAmount)), fileWriteOptions, (saveFileErr) => {
        if (saveFileErr) {
          throw saveFileErr;
        }
        console.log(`Файл сохранен!`);
        process.exit(0);
      });
    }
  });
};

module.exports = {
  name: `undefined`,
  description: `Shows program purpose`,
  execute() {
    rl.question(`Привет пользователь! Сгенерируем данные? (yes/no): `, (genDataAnswer) => {
      switch (genDataAnswer) {
        case `yes`:
          rl.question(`Cколько элементов нужно создать? `, (elementsAmountAnswer) => {
            entityAmount = elementsAmountAnswer;
            rl.question(`Укажите путь до файла, в котором нужно сохранить данные: `, (filePathAnswer) => {
              checkFilePathCallback(filePathAnswer);
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
