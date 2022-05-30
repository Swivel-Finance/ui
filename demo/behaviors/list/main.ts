import { FocusListBehavior, ListBehavior } from '../../../src/behaviors/list/index.js';
import { setAttribute } from '../../../src/utils/dom/index.js';
import { cancel } from '../../../src/utils/events/index.js';
import { ARROW_DOWN, ARROW_UP, BACKSPACE, ENTER } from '../../../src/utils/index.js';

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
let menuItems = menu.querySelectorAll<HTMLLIElement>('li');

const focusListBehavior = new FocusListBehavior({
    role: 'menu',
    itemRole: 'menuitemradio',
});

focusListBehavior.attach(menu, menuItems);
focusListBehavior.setActive('first');

/**
 * Remove an item from the list
 *
 * @remarks
 * When removing an item from the list, we have to requery the items and pass them
 * to the list behaviors `update()` method. The list behavior will try to restore
 * its previous state based on the previously active/selected indices. When removing
 * the last item in the list, the previous item will become active/selected.
 *
 * When removing an item that has focus, the list behavior cannot infer why and when
 * the item lost focus - as such it won't attempt to restore focus. This is up to
 * the consumer who removed a focused item.
 */
const remove = (item: HTMLLIElement): void => {

    item.remove();

    menuItems = menu.querySelectorAll<HTMLLIElement>('li');

    focusListBehavior.update(menuItems);

    focusListBehavior.activeEntry?.item.focus();
};

menuItems.forEach(item => item.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === BACKSPACE) remove(item);
}));
