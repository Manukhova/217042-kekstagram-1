const args = process.argv.slice(2).join(` `);

module.exports = {
  name: `default`,
  description: `Shows error`,
  execute() {
    console.log(`Неизвестная команда ${args}.
    Чтобы прочитать правила использования приложения, наберите "--help"`);
    process.exit(1);
  }
};
