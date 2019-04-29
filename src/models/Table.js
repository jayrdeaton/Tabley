const cosmetic = require('cosmetic'),
  { left, right, stringLength } = require('padstr'),
  Column = require('./Column'),
  { alignmentPadding } = require('../helpers');

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
    if (options.columns) for (let column of options.columns) {
      column = new Column(column);
      this.columns[column.key] = column;
    };
    for (const row of this.rows) for (const key of Object.keys(row)) {
      if (this.columns[key]) {
        const { padding, value } = this.columns[key];
        if (padding < stringLength(value(row[key]))) this.columns[key].padding = stringLength(value(row[key]));
      } else {
        this.columns[key] = new Column({
          key,
          padding: stringLength(key) > stringLength(row[key]) ? stringLength(key) : stringLength(row[key]),
        });
      };
    };
    // meta option updates padding
    if (options.meta) {
      this.meta = options.meta;
      for (const meta of options.meta) for (const key of Object.keys(meta)) if (this.columns[key] && this.columns[key].padding < stringLength(this.columns[key].value(meta[key]))) this.columns[key].padding = stringLength(this.columns[key].value(meta[key]));
    };
    // vertical seperator
    if (options.seperator) this.seperator = options.seperator;
    // alignment
    this.align = options.align ? options.align : 'left';
    // margin
    this.margin = options.margin ? options.margin : 0;
    // table.string
    this.string = '';
    // title
    if (this.title) this.string += `${alignmentPadding(this.align)(this.title, this.width)}\n\n`;
    // column header
    let header = '';
    for (const [index, key] of Object.keys(this.columns).entries()) {
      const column = this.columns[key];
      const align = column.align ? column.align : this.align;
      const pad = alignmentPadding(align);
      header += `${pad(column.title, column.padding + this.margin)}${index === Object.keys(this.columns).length - 1 ? '' : this.seperator}`;
    };
    this.string += `${cosmetic.underline(header)}\n`;
    // rows
    for (const [index, row] of this.rows.entries()) {
      for (const [index, key] of Object.keys(this.columns).entries()) {
        const column = this.columns[key];
        const align = column.align ? column.align : this.align;
        const pad = alignmentPadding(align);
        let value = row[column.key];
        if (value === undefined || value === null) value = ''
        value = column.value(value);
        this.string += `${pad(value, column.padding + this.margin)}${index === Object.keys(this.columns).length - 1 ? '' : this.seperator}`;
      };
      if (index !== this.rows.length - 1) this.string += '\n';
    };
    // meta
    if (this.meta) {
      this.string += '\n\n';
      for (const [index, meta] of this.meta.entries()) {
        for (const [index, key] of Object.keys(this.columns).entries()) {
          const column = this.columns[key];
          const align = column.align ? column.align : this.align;
          const pad = alignmentPadding(align);
          let value = meta[column.key];
          if (value === undefined || value === null) value = ''
          value = column.value(value);
          this.string += `${pad(value, column.padding + this.margin)}${index === Object.keys(this.columns).length - 1 ? '' : this.seperator}`;
        };
        if (index !== this.meta.length - 1) this.string += '\n';
      };
    };
  };
  print() {
    console.log(this.string);
  };
  get width() {
    let width = 0;
    for (const key of Object.keys(this.columns)) width += this.columns[key].padding + this.margin + 1;
    --width;
    return width;
  };
};
