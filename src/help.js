module.exports = {
  name: `help`,
  description: `Shows available commands`,
  execute() {
    console.log(`Доступные команды:
      --help    — печатает этот текст;
      --version — печатает версию приложения`);
  }
};
