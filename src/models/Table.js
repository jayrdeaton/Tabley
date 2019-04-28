const cosmetic = require('cosmetic'),
  { left, right, stringLength } = require('padstr');

module.exports = class Table {
  constructor(rows, options) {
    this.rows = rows;
    this.columns = {};
    this.seperator = '|';
    // options
    if (!options) options = {};
    // table title
    if (options.title) this.title = options.title;
    // columns option updates object and padding
    if (options.columns) for (const column of options.columns) {
      if (!column.title) column.title = column.key;
      if (!column.padding) column.padding = stringLength(column.title);
      if (column.minimum_padding && column.minimum_padding > column.padding) column.padding = column.minimum_padding;
      if (!column.value) column.value = v => v;
      this.columns[column.key] = column;
    };
    for (const row of this.rows) for (const key of Object.keys(row)) {
      if (this.columns[key]) {
        const { padding, value } = this.columns[key];
        if (padding < stringLength(value(row[key]))) this.columns[key].padding = stringLength(value(row[key]));
      } else {
        this.columns[key] = {
          key,
          padding: stringLength(key) > stringLength(row[key]) ? stringLength(key) : stringLength(row[key]),
          title: key,
          value: v => v
        };
      };
    };
    // meta option updates padding
    if (options.meta) {
      this.meta = options.meta;
      for (const meta of options.meta) for (const key of Object.keys(meta)) if (this.columns[key] && this.columns[key].padding < stringLength(meta[key])) this.columns[key].padding = stringLength(meta[key]);
    };
    // vertical seperator
    if (options.seperator) this.seperator = options.seperator;
    // alignment
    if (options.align) this.align = options.align;
    // table.string
    this.string = '';
    // title
    if (this.title) this.string += `${this.title}\n\n`;
    // column header
    let header = '';
    for (const [index, key] of Object.keys(this.columns).entries()) {
      const column = this.columns[key];
      const pad = column.align === 'right' || (!column.align && this.align === 'right') ? left : right;
      header += `${pad(column.title, column.padding)}${index === Object.keys(this.columns).length - 1 ? '' : this.seperator}`;
    };
    this.string += `${cosmetic.underline(header)}\n`;
    // rows
    for (const row of this.rows) {
      for (const [index, key] of Object.keys(this.columns).entries()) {
        const column = this.columns[key];
        const pad = column.align === 'right' || (!column.align && this.align === 'right') ? left : right;
        let value = row[column.key] || '';
        if (column.value) value = column.value(value);
        this.string += `${pad(value, column.padding)}${index === Object.keys(this.columns).length - 1 ? '' : this.seperator}`;
      };
      this.string += '\n';
    };
    // meta
    if (this.meta) {
      this.string += '\n';
      for (const [index, meta] of this.meta.entries()) {
        for (const [index, key] of Object.keys(this.columns).entries()) {
          const column = this.columns[key];
          const pad = column.align === 'right' || (!column.align && this.align === 'right') ? left : right;
          let value = meta[column.key] || '';
          if (column.value) value = column.value(value);
          this.string += `${pad(value, column.padding)}${index === Object.keys(this.columns).length - 1 ? '' : this.seperator}`;
        };
        if (index !== this.meta.length - 1) this.string += '\n';
      };
    };
  };
  print() {
    console.log(this.string);
  };
};
