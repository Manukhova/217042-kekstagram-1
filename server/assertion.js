module.exports = {
  oneOf(choices) {
    return {
      assert(option) {
        return choices.indexOf(option) >= 0;
      },
      message: `should be one of [${choices}]`
    };
  },
  anyOf(choices) {
    return {
      assert(options) {
        const assertion = this.oneOf(choices);
        return options.every((it) => assertion.assert(it));
      },
      message: `should be one of [${choices}]`
    };
  },
  inRange(from, to) {
    return {
      assert(number) {
        return number >= from && number <= to;
      },
      message: `should be in range ${from}..${to}`
    };
  },
  textRange(from, to) {
    return {
      assert(text) {
        return text.length >= from && text.length <= to;
      },
      message: `should be in range ${from}..${to}`
    };
  },
  isImage() {
    return {
      assert(image) {
        return image.mimetype.startsWith(`image/`);
      },
      message: `should be an image`
    };
  },
  isArr() {
    return {
      assert(arr) {
        return Array.isArray(arr);
      },
      message: `should be an array`
    };
  },
  isHashtagArr() {
    return {
      assert() {
        return true;
      },
      message: `should be a hashtag array`
    };
  },
  unique() {
    return {
      assert(options) {
        const set = new Set(options);
        return set.size === options.length;
      },
      message: `should be unique`
    };
  }
};
