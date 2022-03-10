```
██╗   ██╗██╗
██║   ██║██║
██║   ██║██║
██║   ██║██║
╚██████╔╝██║
 ╚═════╝ ╚═╝ [UI for Swivel frontends]
```
## Introduction
This repository contains the building blocks for Swivel frontends. 

It is structured into 4 main modules:
- [assets](https://github.com/Swivel-Finance/ui/tree/main/src/assets): Shared static assets like CSS and SVG files
- [behaviors](https://github.com/Swivel-Finance/ui/tree/main/src/behaviors): Agnostic browser based ui behaviors which can be attached to DOM elements
- [elements](https://github.com/Swivel-Finance/ui/tree/main/src/elements): `LitElement` based custom elements which are shared between Swivel frontends
- [utils](https://github.com/Swivel-Finance/ui/tree/main/src/utils): Shared utility code, like event and DOM utilities, asynchronous helpers, etc

## Usage

Install from npm:

```bash
npm install --save @swivel-finance/ui
```

Use in custom elements:

```typescript
import { ActivateEvent, ListBehavior, SelectEvent } from '@swivel-finance/ui/behaviors/list';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';

const template = function (this: ListElement) {

    return html`
    <ul ${ ref(this.listRef) }
        @ui-activate-item=${ this.handleActivateItem }
        @ui-select-item=${ this.handleSelectItem }>
        ${ this.items.map(item => html`
        <li data-value="${ item.value }" 
            aria-selected="${ this.selected === item ? 'true' : 'false' }">
            ${ item.label }
        </li>`) }
    </ul>
    `;
};

@customElement('my-list')
export class ListElement extends LitElement {

    protected listRef: Ref<HTMLUListElement> = createRef();

    protected listBehavior = new ListBehavior();

    @property()
    protected activeDescendant?: string;

    @state()
    items: Item[] = [];

    @state()
    selected?: Item;

    disconnectedCallback (): void {

        this.listBehavior?.detach();
    }

    render () {
        
        return template.apply(this);
    }

    protected firstUpdated () {

        const list = this.listRef.value as HTMLElement;
        const items = list.querySelectorAll('li');

        this.listBehavior?.attach(list, items);
        this.listBehavior?.setActive(this.listBehavior.selectedEntry ?? 'first', true);
    }

    protected handleActivateItem (event: ActivateEvent) {

        this.activeDescendant = event.detail.current?.item.id;
    }

    protected handleSelectItem (event: SelectEvent) {

        const selectedValue = event.detail.current?.item.dataset.value as string ?? '';

        this.selected = this.items.find(item => item.value === selectedValue);
    }
}
```

## Development

### Initializing the repository

Clone the repository and install dependencies:

```bash
git clone git@github.com:Swivel-Finance/ui.git

cd ui

npm ci
```

### Running locally

The repository contains a `/demo` folder with live demos of the behaviors and custom elements. This also serves for local development. You can serve the demo application and run the TypeScript compiler and postcss in watch mode by running:

```bash
npm run start
```

Alternatively, you can run separate tasks in multiple terminal windows:

```bash
npm run build:watch
```
```bash
npm run css:watch
```
```bash
npm run serve
```

### Lint, test & build:

```bash
npm run prerelease
```

There are commands for running steps individually as well, check out the scripts section in package.json for that.

### Commiting changes

When commiting changes to the repository, make sure your commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. You can also use the provided script to help you ensure proper commit messages:

```bash
npm run commit
```

> This is important as the release management in this repository is automated and based on conventional commits. In addition, the [CHANGELOG.md](https://github.com/Swivel-Finance/ui/blob/main/CHANGELOG.md) is generated from the commit messages as well.

### Releasing new versions

To release a new version of this library run:

```bash
npm run release
```

> Before running a release, ensure you have merged your PR to **main** and only run the release script on the **main** branch.

This will first clean the `dist` directory, lint the code and do a production build of the library and the styles. If successful `standard-version` is going to determine the next semantic version number for the release based on the commit history. It will automatically update the `package.json` and `CHANGELOG.md` and create a new commit and a matching tag on your local branch.

You can check the changelog and the results from the local release and if you're happy, run:

```bash
npm run release:publish
```

This second step takes the local changes and pushes them to origin (including the new tag) and publishes the build result as package to npm.

> The separation of the release into 2 steps is done on purpose. The first step will create a release locally only. So if anything goes wrong, you have the ability to revert your changes and not have them published.

> When publishing to npm, you need to be logged in with the Swivel npm account. You can do that by running `npm login` in the repository root. This will also generate a `.npmrc` file in the directory storing an authToken. **This token must be git-ignored.**
