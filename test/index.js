const Table = require('../'),
  cosmetic = require('cosmetic');

const table = new Table([
  {
    columnA: '1A',
    columnB: '1B',
    columnC: '1C'
  },
  {
    columnA: '2A',
    columnB: '2B',
    columnC: '2C'
  },
  {
    columnA: '3A444',
    columnB: '3B',
    columnC: '3C'
  }
], {
  title: 'Test',
  columns: [
    { key: 'columnA', title: 'Column A', minimum_padding: 20, align: 'left' },
    'columnB',
    { key: 'columnC', title: 'C', value: (v) => cosmetic.green(v) }
  ],
  meta: [
    { columnA: 'meta' },
    { columnC: 'metaC' }
  ],
  align: 'center',
  seperator: cosmetic.red('|'),
  margin: 5
});

table.print();
