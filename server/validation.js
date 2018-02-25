const {inRange, textRange, isImage, isArr, oneOf} = require(`./assertion`);

const MAX_SCALE_LENGTH = 100;
const MIN_SCALE_LENGTH = 0;

const MAX_DESC_LENGTH = 140;
const MIN_DECS_LENGTH = 0;

const effectList = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];

const requiredEffectField = (set) => {
  return {
    required: true,
    assertions: [
      oneOf(set)
    ]
  };
};

const schema = {
  'scale': {
    required: true,
    assertions: [
      inRange(MIN_SCALE_LENGTH, MAX_SCALE_LENGTH)
    ]
  },
  'filename': {
    required: true,
    assertions: [
      isImage()
    ]
  },
  'description': {
    required: false,
    assertions: [
      textRange(MIN_DECS_LENGTH, MAX_DESC_LENGTH)
    ]
  },
  'hashtags': {
    required: false,
    assertions: [
      isArr()
    ]
  },
  'effect': requiredEffectField(effectList)
};

module.exports = schema;
