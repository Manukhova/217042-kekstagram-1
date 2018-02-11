const colors = require('colors');

module.exports = {
  name: `undefined`,
  description: `Shows program purpose`,
  execute() {
    console.log(`Привет пользователь!
      Эта программа будет запускать сервер ${colors.cyan(`«Kekstagram»`)}.`);
  }
};
