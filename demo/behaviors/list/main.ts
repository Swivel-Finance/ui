import { FocusListBehavior, ListBehavior } from '../../../src/behaviors/list/index.js';
import { setAttribute } from '../../../src/utils/dom/index.js';
import { cancel } from '../../../src/utils/events/index.js';
import { ARROW_DOWN, ARROW_UP, ENTER } from '../../../src/utils/index.js';

const search = document.querySelector('.filter input[type=text]') as HTMLInputElement;
const list = document.querySelector('.filter ul') as HTMLUListElement;
const items = list.querySelectorAll<HTMLLIElement>('li');

const listBehavior = new ListBehavior({
    role: 'listbox',
    itemRole: 'option',
    orientation: 'vertical',
});

listBehavior.attach(list, items);

search.addEventListener('keydown', event => {

    switch (event.key) {

        case ARROW_UP:
            cancel(event);
            listBehavior.setActive('previous', true);
            break;

        case ARROW_DOWN:
            cancel(event);
            listBehavior.setActive('next', true);
            break;

        case ENTER:
            cancel(event);
            if (listBehavior.activeEntry) listBehavior.setSelected(listBehavior.activeEntry, true);
            break;
    }
});

search.addEventListener('focus', () => {

    listBehavior.setActive(listBehavior.selectedEntry ?? 'first', true);
});

search.addEventListener('input', () => {

    filterList(search.value);

    if (!listBehavior.activeEntry || listBehavior.activeEntry.item.hidden) {

        if (search.value !== '') {

            listBehavior.setActive('first', true);

        } else {

            listBehavior.setActive(listBehavior.selectedEntry ?? 'first', true);
        }
    }
});

function filterList (term: string) {

    term = term.toLowerCase();

    items.forEach(item => {

        const match = term !== '' && !item.innerText.toLowerCase().includes(term);

        item.hidden = match;
    });

    listBehavior.scrollTo('active');
}

list.addEventListener('ui-activate-item', event => {

    setAttribute(search, 'aria-activedescendant', event.detail.current?.item.id);
});



/**
 * FocusListBehavior
 */

const menu = document.querySelector('.menu ul') as HTMLUListElement;
const menuItems = menu.querySelectorAll<HTMLLIElement>('li');

const focusListBehavior = new FocusListBehavior({
    role: 'menu',
    itemRole: 'menuitemradio',
});

focusListBehavior.attach(menu, menuItems);
focusListBehavior.setActive('first');
