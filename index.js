const args = process.argv.slice(2)[0];

switch(args) {
  case '--version':
    console.log('v0.0.1');
    process.exit(0);
  case '--help':
    console.log(`
      Доступные команды:
      --help    — печатает этот текст;
      --version — печатает версию приложения`);
    process.exit(0);
  case undefined:
    console.log(`
      Привет пользователь!
      Эта программа будет запускать сервер «Kekstagram».
      Автор: Кекс.`);
    process.exit(0);
  default:
    console.error(`
      Неизвестная команда ${args}.
      Чтобы прочитать правила использования приложения, наберите "--help"'`
    );
    process.exit(1);
}
