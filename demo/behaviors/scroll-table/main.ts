import { ScrollTableBehavior } from '../../../src/behaviors/scroll-table/index.js';

const tables = document.querySelectorAll<HTMLTableElement>('.ui-scroll-table-area table');

tables.forEach(table => {

    const scrollTable = new ScrollTableBehavior();

    scrollTable.attach(table);
});
