const effectList = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];

const randomIndex = Math.floor(Math.random() * effectList.length);

const MAX_RANDOM_STRING_LENGTH = 19;

const MAX_RANDOM_ARRAY_LENGTH = 5;

const randomString = (word, constraint, hasSpace) => {
  let alphabet = hasSpace ?
    `абвгдеёжзийклмнопрстуфхцчшщъыьэюя   ` : `абвгдеёжзийклмнопрстуфхцчшщъыьэюя`;
  let randomWord = word || ``;

  for (let i = 0; i < Math.floor(Math.random() * constraint); i++) {
    randomWord += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
  }
  randomWord += +new Date();
  return randomWord;
};

const generateRandomStringArray = (lengthConstraint, wordConstraint, word, hasSpace) => {
  let randomStringArray = [];

  for (let i = 0; i < lengthConstraint; i++) {
    randomStringArray.push(randomString(word, wordConstraint, hasSpace));
  }
  return randomStringArray;
};

const firstJan17 = 1483218000000;
const now = new Date().getTime();

const generateEntity = () => {
  return {
    url: `https://picsum.photos/600/?random`,
    scale: Math.ceil(Math.random() * 100),
    effect: effectList[randomIndex],
    hashtags: generateRandomStringArray(MAX_RANDOM_ARRAY_LENGTH, MAX_RANDOM_STRING_LENGTH, `#`),
    description: `Данная функция генерирует данные`,
    likes: Math.ceil(Math.random() * 1000),
    comments: generateRandomStringArray(10, 140, ``, true),
    date: Math.floor(Math.random() * now) + firstJan17
  };
};

module.exports = generateEntity;
