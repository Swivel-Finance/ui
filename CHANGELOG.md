# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.11](https://github.com/Swivel-Finance/ui/compare/v0.0.10...v0.0.11) (2022-05-19)


### Bug Fixes

* **focus-monitor:** make nested `FocusMonitor`s work correctly ([bed9200](https://github.com/Swivel-Finance/ui/commit/bed9200fd89966268ec62d17aaf0749ec8dd1984)), closes [#12](https://github.com/Swivel-Finance/ui/issues/12)

### [0.0.10](https://github.com/Swivel-Finance/ui/compare/v0.0.9...v0.0.10) (2022-04-21)


### Bug Fixes

* **behaviors/overlay:** add `aria-modal` on supported roles only ([3454e7b](https://github.com/Swivel-Finance/ui/commit/3454e7b8cc1bed96d227bb2fa16334a72f19353b))
* **tooltip-trigger:** improve show/hide behavior for triggers with multiple overlays ([79ffd54](https://github.com/Swivel-Finance/ui/commit/79ffd541ac463c2b918fe5f7fbf9b9b92476269c))

### [0.0.9](https://github.com/Swivel-Finance/ui/compare/v0.0.8...v0.0.9) (2022-04-19)


### Bug Fixes

* **behaviors/list:** dispatch update event from list behavior when items change ([8812f53](https://github.com/Swivel-Finance/ui/commit/8812f53fc4fdec9f157ed098041f0903a115da43))

### [0.0.8](https://github.com/Swivel-Finance/ui/compare/v0.0.7...v0.0.8) (2022-04-19)


### Bug Fixes

* **elements/listbox:** update listbox when the selection attribute is changed from the outside/template ([011f1d6](https://github.com/Swivel-Finance/ui/commit/011f1d6a3a50ddd6eead04a81a7d0df8ae5b749b))

### [0.0.7](https://github.com/Swivel-Finance/ui/compare/v0.0.6...v0.0.7) (2022-04-15)


### Features

* **elements/select:** enable custom select trigger ([1fab4a4](https://github.com/Swivel-Finance/ui/commit/1fab4a45922d02f58c0a9cd2bdc12134aa5149de))

### [0.0.6](https://github.com/Swivel-Finance/ui/compare/v0.0.5...v0.0.6) (2022-04-13)


### Bug Fixes

* **behaviors/list:** detect cycles in list navigation ([67dca77](https://github.com/Swivel-Finance/ui/commit/67dca77eaaa6ddd6542f7d1d0f6b109d65a3f705))

### [0.0.5](https://github.com/Swivel-Finance/ui/compare/v0.0.4...v0.0.5) (2022-04-13)


### Features

* **behaviors/focus:** add option to tab out of focus traps ([0d360f3](https://github.com/Swivel-Finance/ui/commit/0d360f3631b9608927f42f8b88a26a59f46825d9))
* **behaviors/list:** add support for wrapping keyboard navigation ([8b2b54e](https://github.com/Swivel-Finance/ui/commit/8b2b54e907701a02d0b466c2d1f10c1a60aeb3d2))
* **behaviors/overlay:** add mirror option to `toggleVisibility` ([d4d0000](https://github.com/Swivel-Finance/ui/commit/d4d000050ff667844c84561aa095d9b5fbfd29f5))
* **elements/icon:** add icon element ([dd951d2](https://github.com/Swivel-Finance/ui/commit/dd951d27b28565d7a299ceac4b9fcf4560f82b37))
* **elements/input:** add input element base class ([1d72d4c](https://github.com/Swivel-Finance/ui/commit/1d72d4c8db9640b5e7372c0cbebd75c0effb069c))
* **elements/listbox:** add listbox element ([8ad72dd](https://github.com/Swivel-Finance/ui/commit/8ad72ddb10fd0894b3f92d0cec71b7ade712b167))
* **elements/popup:** add popup element ([3b04d0c](https://github.com/Swivel-Finance/ui/commit/3b04d0cc0922843ade3e7b45ba9d551de3984cad))
* **elements/select:** add select element ([f6a0bdb](https://github.com/Swivel-Finance/ui/commit/f6a0bdb0c6a7ebb1f0ae5c7c7bf08bf91ae4951d))


### Bug Fixes

* **behaviors/focus:** improve `trapFocus` handling ([db64622](https://github.com/Swivel-Finance/ui/commit/db646225ab6d5c94299d41bd53eaee0f19f18452))
* **behaviors/overlay:** add backdrop styles ([00c29e2](https://github.com/Swivel-Finance/ui/commit/00c29e271112f54fa515d62bb1d00c7697f32b9f))
* **behaviors/position:** `maxWidth` config option ([df3500b](https://github.com/Swivel-Finance/ui/commit/df3500b1717e5afbc91840c936bf5e1f0dae40fe))
* **behaviors/position:** adjust the css position of 'end'-aligned elements ([3d630ee](https://github.com/Swivel-Finance/ui/commit/3d630eef7985e0f10619d69d32a04ac6a370eb6b))
* **behavors/trigger:** add `aria-controls` attribute to overlay trigger ([79f7c5f](https://github.com/Swivel-Finance/ui/commit/79f7c5feaeffa732f542732ba1cb3ea9a5f6b9ab))
* **elements/listitem:** ensure text-overflow on listitem and menu items ([680a4e5](https://github.com/Swivel-Finance/ui/commit/680a4e52d70b283bbaed94f08857563a3a1ffcf1))
* **elements/tooltip:** use consistent `ui`-prefix for elements ([f6f7b42](https://github.com/Swivel-Finance/ui/commit/f6f7b42bc3c9529113364197bf64a2dbc1ea22e8))

### [0.0.4](https://github.com/Swivel-Finance/ui/compare/v0.0.3...v0.0.4) (2022-03-22)


### Bug Fixes

* **overlay-trigger:** ensure `aria-expanded` is updated when overlay animation starts ([2a180f1](https://github.com/Swivel-Finance/ui/commit/2a180f157217fed22c3e817621daed9bac972c6c))
* **overlay:** ensure hidden overlays are set to `display: none;` ([3ebd3e3](https://github.com/Swivel-Finance/ui/commit/3ebd3e34600ecb4cf258c96d5d9cbdf5490afaf9))
* **position:** ensure positioning always sets max sizes for positioned elements ([d7ee453](https://github.com/Swivel-Finance/ui/commit/d7ee453a241f2b77e2822a7dc3e166784db8eb4f))

### [0.0.3](https://github.com/Swivel-Finance/ui/compare/v0.0.2...v0.0.3) (2022-03-17)


### Features

* **utils/dom/animations:** allow excluding animations from being awaited ([a262d8c](https://github.com/Swivel-Finance/ui/commit/a262d8cc9015c48ef7ebe41f9c704d9782e1d3e9))

### [0.0.2](https://github.com/Swivel-Finance/ui/compare/v0.0.1...v0.0.2) (2022-03-15)


### Bug Fixes

* **overlay:** handle `MarkerRemovedEvent`s ([cda97d9](https://github.com/Swivel-Finance/ui/commit/cda97d9cff63a172d934511dda54bc0bd0020184))

### 0.0.1 (2022-03-10)


### Features

* **elements:** add tooltip element ([928a064](https://github.com/Swivel-Finance/ui/commit/928a064421224fb6a6ac1fb64ed9cc61561f9ef5)), closes [#2](https://github.com/Swivel-Finance/ui/issues/2)
* **styles:** add reset and theme styles ([143173c](https://github.com/Swivel-Finance/ui/commit/143173c877af9a4134146f78e9554c59147cebf6))
