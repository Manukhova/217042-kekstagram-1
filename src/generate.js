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

const generateData = (amount) => {
  const generatedData = [];
  for (let i = 0; i < amount; i++) {
    const newEntity = generateEntity();
    generatedData.push(newEntity);
  }
  return generatedData;
};

const checkFilePathCallback = (filePathAnswer, elementsAmountAnswer) => {
  return open(filePathAnswer, `wx`)
      .then(() => {
        return writeFile(filePathAnswer, JSON.stringify(generateData(elementsAmountAnswer)), fileWriteOptions)
            .then(() => {
              console.log(`Файл записан`);
              process.exit(0);
            });
      })
      .catch((filePathErr) => {
        if (filePathErr) {
          if (filePathErr.code === `EEXIST`) {
            return question(`Такой файл уже существует, нужно ли его перезаписать? (yes/no): `)
                .then((shouldRewriteAnswer) => {
                  if (shouldRewriteAnswer !== `yes`) {
                    console.log(`Файл не перезаписан`);
                    process.exit(0);
                  }
                  return writeFile(filePathAnswer, JSON.stringify(generateData(elementsAmountAnswer)), fileWriteOptions)
                      .then(() => {
                        console.log(`Файл перезаписан`);
                        rl.close();
                      });
                });
          }
        }
      });
};

const noCommandObject = {
  name: `undefined`,
  description: `Shows program purpose`,
  execute() {
    question(`Привет пользователь! Сгенерируем данные? (yes/no): `)
        .then((genDataAnswer) => {
          switch (genDataAnswer) {
            case `yes`:
              return question(`Cколько элементов нужно создать? `)
                  .then((elementsAmountAnswer) => {
                    return question(`Укажите путь до файла, в котором нужно сохранить данные: `)
                        .then((filePathAnswer) => {
                          checkFilePathCallback(filePathAnswer, elementsAmountAnswer);
                        });
                  });
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
