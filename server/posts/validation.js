const isImage = () => {
  return {
    assert(image) {
      return image.mimetype.startsWith(`image/`);
    },
    message: `should be an image`
  };
};

const isString = () => {
  return {
    assert(string) {
      return typeof string === `string`;
    },
    message: `should be a string`
  };
};

const isNumber = () => {
  return {
    assert(number) {
      return typeof number === `number`;
    },
    message: `should be a number`
  };
};

const isArray = () => {
  return {
    assert(array) {
      return Array.isArray(array);
    },
    message: `should be a array`
  };
};

const schema = {
  'filename': {
    required: true,
    assertions: [
      isImage()
    ]
  },
  'fio': {
    required: true,
    assertions: [
      isString()
    ]
  },
  'phone': {
    required: true,
    assertions: [
      isString()
    ]
  },
  'email': {
    required: true,
    assertions: [
      isString()
    ]
  },
  'roomsNumber': {
    required: true,
    assertions: [
      isNumber()
    ]
  },
  'flatSquare': {
    required: true,
    assertions: [
      isNumber()
    ]
  },
  'clothesToClean': {
    required: true,
    assertions: [
      isArray()
    ]
  },
  'food': {
    required: true,
    assertions: [
      isArray()
    ]
  },
  'broken': {
    required: true,
    assertions: [
      isString()
    ]
  },
  'dogBreed': {
    required: true,
    assertions: [
      isString()
    ]
  },
  'dogMood': {
    required: true,
    assertions: [
      isString()
    ]
  }
};

module.exports = schema;
