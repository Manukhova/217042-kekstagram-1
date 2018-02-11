const args = process.argv.slice(2)[0];

switch (args) {
  case `--version`:
    console.log(`v0.0.1`);
    break;
  case `--help`:
    console.log(`Доступные команды:
      --help    — печатает этот текст;
      --version — печатает версию приложения`);
    break;
  case void(0):
    console.log(`Привет пользователь!
      Эта программа будет запускать сервер «Kekstagram».
      Автор: Кекс.`);
    break;
  default:
    let defaultMsg = process.argv.slice(2).join(' ');
    console.error(`
      Неизвестная команда ${defaultMsg}.
      Чтобы прочитать правила использования приложения, наберите "--help"`
    );
    process.exit(1);
}
