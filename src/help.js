const colors = require('colors');

module.exports = {
  name: `help`,
  description: `Shows available commands`,
  execute() {
    console.log(`Доступные команды:
      --${colors.gray(`help`)} — ${colors.green(`печатает этот текст`)};
      --${colors.gray(`version`)} — ${colors.green(`печатает версию приложения`)}`)
  }
}
