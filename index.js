const args = process.argv.slice(2);

switch (args[0]) {
  case `--version`:
    console.log(`v0.0.1`);
    break;
  case `--help`:
    console.log(`Доступные команды:
      --help    — печатает этот текст;
      --version — печатает версию приложения`);
    break;
  case void 0:
    console.log(`Привет пользователь!
      Эта программа будет запускать сервер «Kekstagram».
      Автор: Кекс.`);
    break;
  default:
    console.error(`
      Неизвестная команда ${args.join(` `)}.
      Чтобы прочитать правила использования приложения, наберите "--help"`
    );
    process.exit(1);
}
