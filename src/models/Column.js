const { stringLength } = require('padstr');

module.exports = class Column {
  constructor(data) {
    if (typeof data === 'string') data = { key: data };
    this.key = data.key || '';
    this.title = data.title || this.key;
    this.padding = data.padding || 0;
    this.align = data.align;
    if (stringLength(this.title) > this.padding) this.padding = stringLength(this.title);
    if (data.minimum_padding && data.minimum_padding > this.padding) this.padding = data.minimum_padding;
    this.value = data.value ? data.value : v => v;
  };
};
