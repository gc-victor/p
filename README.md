# P

P is a micro-library (<1.2 KB) to patch DOM Trees. Instead of using a Virtual DOM, it uses dom-diff to update the DOM if there is a child active element. Otherwise, it will take one tree by the other.

## Key Features

- Micro-library <1.2 KB
- Without dependencies
- No compilation needed
- No Virtual DOM, uses dom-diff to update the DOM
- Zero Dependencies
- Small API, not much to learn

## Let's Play

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
            import p from 'https://cdn.jsdelivr.net/gh/gc-victor/p/dist/esm/index.js';
            // Use any template engine of your choice that creates DOM trees
            import { t } from 'https://cdn.jsdelivr.net/gh/gc-victor/t/dist/esm/index.js';

            let count = 0;

            const increment = () => {
                count = count + 1;
                // Updates the DOM
                p(document.getElementById('app'), counter());
            };
            const decrement = () => {
                count = count - 1;
                // Updates the DOM
                p(document.getElementById('app'), counter());
            };
            const add = (ev) => {
                count = Number(ev.target.value);
                // Updates the DOM
                p(document.getElementById('app'), counter());
            };

            const counter = () => {
                return t`
                    <div id="app">
                        <h1>Counter</h1>
                        <button onclick="${increment}">+</button>
                        <input oninput="${add}" name="input" type="number" value="${count}" />
                        <button onclick="${decrement}">-</button>
                    </div>
                `;
            };

            // Updates the DOM
            p(document.getElementById('app'), counter());
        </script>
    </head>
    <body>
        <main id="app">
            <h1>Counter</h1>
            <button>+</button><input name="c" type="number" value="0"><button>-</button>
        </main>
    </body>
</html>
```

## Install

You can use pnpm, npm or yarn to install it.

```console
npm install git+https://github.com/gc-victor/p.git#main
```

Import it in your framework.

```js
import p from 'p';
```

Or import it in a `<script>` as a module.

```html
<script type="module">
    import p from 'https://cdn.jsdelivr.net/gh/gc-victor/p/dist/esm/index.js';
</script>
```

## API

You can create as many patches as you need. The first parameter is where you want to make the change, and the second specifies what you wish to change.

```javascript
// p(where, what)
p(document.getElementById('app'), count());
```

## Acknowledgments

### Inspiration

-   [udomdiff](https://github.com/WebReflection/udomdiff)
-   [dom-expressions](https://github.com/ryansolid/dom-expressions)
-   [h-h](https://github.com/gc-victor/h-h)

### Tools

-   [esbuild](https://esbuild.github.io/)
-   [gzip-size](https://esbuild.github.io/)
-   [d-d](https://github.com/gc-victor/d-d)
-   [esm](https://github.com/standard-things/esm)
-   [es-module-shims](https://github.com/guybedford/es-module-shims)
-   [jsdom](https://github.com/jsdom/jsdom)
-   [t-t](https://github.com/gc-victor/t-t)
-   [chokidar-cli](https://github.com/kimmobrunfeldt/chokidar-cli)

## Compatible Versioning

### Summary

Given a version number MAJOR.MINOR, increment the:

- MAJOR version when you make backwards-incompatible updates of any kind
- MINOR version when you make 100% backwards-compatible updates

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR format.

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Commit message conventions

A specification for adding human and machine readable meaning to commit messages.

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone http://github.com/<your-username>/p`
-   Navigate to the newly cloned directory: `cd p`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/p/blob/master/LICENSE)

Copyright (c) 2021 Víctor García

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
