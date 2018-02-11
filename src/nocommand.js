const packageInfo = require(`../package.json`);

module.exports = {
  name: `undefined`,
  description: `Shows program purpose`,
  execute() {
    console.log(`Привет пользователь!
      Эта программа будет запускать сервер «Kekstagram».
      Автор: ${packageInfo.author}.
      Лицензия: ${packageInfo.license}.
      Описание: ${packageInfo.description}`);
  }
};
