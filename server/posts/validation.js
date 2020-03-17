const isImage = () => {
  return {
    assert(image) {
      return image.mimetype.startsWith(`image/`);
    },
    message: `should be an image`
  };
}

const schema = {
  'filename': {
    required: true,
    assertions: [
      isImage()
    ]
  }
};

module.exports = schema;
