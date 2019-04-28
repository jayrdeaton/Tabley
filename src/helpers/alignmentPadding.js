const { center, left, right } = require('padstr');

module.exports = (align) => {
  switch (align) {
    case 'center':
      return center;
    case 'right':
      return left;
    default:
      return right;
  }
};
