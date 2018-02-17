const generateEntity = () => {
  return {
    url: `https://picsum.photos/600/?random`,
    scale: 100,
    effect: `chrome`,
    hashtags: [`#hashtag1`, `#hashtag2`],
    description: `Описание`,
    likes: 500,
    comments: [`Всем привет!`, `Как дела?`]
  };
};

module.exports = generateEntity;
