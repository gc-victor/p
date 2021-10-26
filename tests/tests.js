import { expect, test as t, window } from 't-t';
import jsdom from 'jsdom';
import { h } from './h';
import { patch } from '../src/patch';
import { doubleTree } from '../src/doubleTree';
import { patchTrees } from '../src/patch-trees';

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><body><div id="app"><p>Hello world!</p></div></body>`, {
    url: 'https://p-p.p/',
});
window('window', dom.window);
window('document', dom.window.document);

const test = t;
// const only = t;
// const test = () => {};

const createApp = () => {
    const div = document.createElement('div');
    const p = document.createElement('p');

    div.setAttribute('id', 'app');
    div.appendChild(p);
    p.textContent = 'Hello world!';

    return div;
};

const useApp = () => {
    const app = document.getElementById('app');

    app.innerHTML = '';

    return app;
};

test('should replace the element [patch]', () => {
    const app = useApp();
    const newApp = createApp();
    const p = newApp.querySelector('p');

    p.textContent = 'test';

    patch(app, newApp);

    expect(document.getElementById('app').outerHTML).toBe('<div id="app"><p>test</p></div>');
});

test('should remove the "where" when the "what" is falsy [patch]', () => {
    const app = useApp();
    const newApp = createApp();
    const p = newApp.querySelector('p');

    p.textContent = 'test';

    patch(app, '');

    expect(document.querySelector('body').outerHTML).toBe('<body></body>');

    // After the assert to bring back the <div id="app" /> element
    const div = document.createElement('div');
    div.setAttribute('id', 'app');
    document.querySelector('body').appendChild(div);
});

test('should generate the previous tree [doubleTree]', () => {
    const app = useApp();
    const newApp = createApp();

    app.innerHTML = '<p id="p-test"><input id="input-test" type="text"></p>';
    newApp.innerHTML = '<p><input class="input-test" type="text"></p>';

    const activeElement = app.querySelector('input');

    activeElement.focus();

    const { p } = doubleTree(app, newApp, activeElement);

    // Previous
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p id="p-test"><input id="input-test" type="text"></p></div>'
    );
    expect(p[1].outerHTML).toBe('<p id="p-test"><input id="input-test" type="text"></p>');
    expect(p[2].outerHTML).toBe('<input id="input-test" type="text">');
});

test('should generate the next tree [doubleTree]', () => {
    const app = useApp();
    const newApp = createApp();

    app.innerHTML = '<p id="p-test"><input id="input-test" type="text"></p>';
    newApp.innerHTML = '<p><input class="input-test" type="text"></p>';

    const activeElement = app.querySelector('input');

    activeElement.focus();

    const { n } = doubleTree(app, newApp, activeElement);

    // Next
    expect(n[0].outerHTML).toBe(
        '<div id="app"><p><input class="input-test" type="text"></p></div>'
    );
    expect(n[1].outerHTML).toBe('<p><input class="input-test" type="text"></p>');
    expect(n[2].outerHTML).toBe('<input class="input-test" type="text">');
});

test('should generate the previous ancestry tree [doubleTree]', () => {
    const app = useApp();
    const newApp = createApp();

    app.innerHTML = '<p id="p-test"><input id="input-test" type="text"></p>';
    newApp.innerHTML = '<p><input class="input-test" type="text"></p>';

    const activeElement = app.querySelector('input');

    activeElement.focus();

    const { pAncestry } = doubleTree(app, newApp, activeElement);

    // Previous Ancestry
    expect(pAncestry[0].outerHTML).toBe('<input id="input-test" type="text">');
    expect(pAncestry[1].outerHTML).toBe('<p id="p-test"><input id="input-test" type="text"></p>');
    expect(pAncestry[2].outerHTML).toBe(
        '<div id="app"><p id="p-test"><input id="input-test" type="text"></p></div>'
    );
});

test('should generate the new ancestry tree [doubleTree]', () => {
    const app = useApp();
    const newApp = createApp();
    // TODO: in another test case get new active element by __key__
    app.innerHTML = '<p id="p-test"><input name="input-test" type="text"></p>';
    newApp.innerHTML = '<p><input class="class-test" name="input-test" type="text"></p>';

    const activeElement = app.querySelector('input');

    activeElement.focus();

    const { nAncestry } = doubleTree(app, newApp, activeElement);

    // Previous Ancestry
    expect(nAncestry[0].outerHTML).toBe('<input class="class-test" name="input-test" type="text">');
    expect(nAncestry[1].outerHTML).toBe(
        '<p><input class="class-test" name="input-test" type="text"></p>'
    );
    expect(nAncestry[2].outerHTML).toBe(
        '<div id="app"><p><input class="class-test" name="input-test" type="text"></p></div>'
    );
});

test('should get the new active element [doubleTree]', () => {
    const app = useApp();
    const newApp = createApp();

    app.innerHTML = '<p id="p-test"><input name="input-test" type="text"></p>';
    newApp.innerHTML = '<p><input class="class-test" name="input-test" type="text"></p>';

    const activeElement = app.querySelector('input');

    activeElement.focus();

    const { nActiveElement } = doubleTree(app, newApp, activeElement);

    // New Active Element
    expect(nActiveElement.outerHTML).toBe(
        '<input class="class-test" name="input-test" type="text">'
    );
});

test('should add the new attributes and remove the previous from every ancestry [patch]', () => {
    const app = useApp();
    const newApp = createApp();

    app.innerHTML =
        '<p id="previous-paragraph-test"><input id="previous-input-test" type="text"></p>';
    newApp.innerHTML =
        '<p id="new-paragraph-test" class="new-paragraph-test"><input id="new-input-test" class="new-inout-test" type="text"></p>';

    const activeElement = app.querySelector('input');

    activeElement.focus();
    patch(app, newApp);

    expect(document.getElementById('app').outerHTML).toBe(
        '<div id="app"><p id="new-paragraph-test" class="new-paragraph-test"><input id="new-input-test" class="new-inout-test" type="text"></p></div>'
    );
});

test('should add the new __handlers__ to every previous ancestry [doubleTree]', () => {
    const newApp = h('div', { id: 'app' }, [
        h('form', { onSubmit: () => 'previous-onSubmit' }, [
            h('p', {}, [
                h(
                    'input',
                    {
                        key: 'key ;)',
                        className: 'previous-input-class',
                        onInput: () => 'previous-onInput',
                        type: 'text',
                    },
                    []
                ),
            ]),
        ]),
    ]);
    patch(useApp(), newApp);
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><form><p><input class="previous-input-class" type="text"></p></form></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('form', { onSubmit: () => 'next-onSubmit' }, [
                h('p', { className: 'next-p-class' }, [
                    h(
                        'input',
                        {
                            key: 'key ;)',
                            className: 'next-input-class',
                            type: 'text',
                            onInput: () => 'next-onInput',
                        },
                        []
                    ),
                ]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><form><p class="next-p-class"><input type="text" class="next-input-class"></p></form></div>'
    );
    expect(p[1].__handler__.submit.toString()).toBe("() => 'next-onSubmit'");
    expect(p[3].__handler__.input.toString()).toBe("() => 'next-onInput'");
    expect(p[3]).toBe(document.activeElement);
});

test('should add new elements to the previous tree [doubleTree][patchTrees]', () => {
    const newApp = h('div', { id: 'app' }, [
        h('form', {}, [h('p', {}, [h('input', { key: 'test', id: 'test', type: 'text' }, [])])]),
    ]);
    patch(useApp(), newApp);
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><form><p><input id="test" type="text"></p></form></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, ['Test']),
            h('form', {}, [
                h('p', {}, ['Test']),
                h('p', {}, [
                    h('label', { htmlFor: 'test' }, ['Test']),
                    h('input', { key: 'test', id: 'test', type: 'text' }, []),
                ]),
                h('ul', {}, [
                    h('li', {}, ['0']),
                    h('li', {}, ['1']),
                    h('li', {}, ['2']),
                    h('li', {}, ['3']),
                ]),
                h('p', {}, ['Test']),
            ]),
            h('p', {}, ['Test']),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p>Test</p><form><p>Test</p><p><label for="test">Test</label><input id="test" type="text"></p><ul><li>0</li><li>1</li><li>2</li><li>3</li></ul><p>Test</p></form><p>Test</p></div>'
    );
    expect(p[3]).toBe(document.activeElement);
});

test('should remove old elements to the previous tree [doubleTree][patchTrees]', () => {
    const newApp = h('div', { id: 'app' }, [
        h('p', {}, ['Test1']),
        h('form', {}, [
            h('p', {}, ['Test']),
            h('p', {}, [
                h('label', { htmlFor: 'test' }, ['Test']),
                h('input', { id: 'test', name: 'test', type: 'text' }, []),
            ]),
            h('p', {}, ['Test']),
        ]),
        h('p', {}, ['Test2']),
    ]);
    patch(useApp(), newApp);
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p>Test1</p><form><p>Test</p><p><label for="test">Test</label><input id="test" name="test" type="text"></p><p>Test</p></form><p>Test2</p></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('form', {}, [
                h('p', {}, [h('input', { id: 'test', name: 'test', type: 'text' }, [])]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><form><p><input id="test" name="test" type="text"></p></form></div>'
    );
    expect(p[6]).toBe(document.activeElement);
});

test('should remove old elements to the previous tree [doubleTree][patchTrees]', () => {
    const newApp = h('div', { id: 'app' }, [
        h('p', {}, ['Test1']),
        h('form', {}, [
            h('p', {}, ['Test']),
            h('p', {}, [
                h('label', { htmlFor: 'test' }, ['Test']),
                h('input', { id: 'test', type: 'text' }, []),
            ]),
            h('p', {}, ['Test']),
        ]),
        h('p', {}, ['Test2']),
    ]);
    patch(useApp(), newApp);
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p>Test1</p><form><p>Test</p><p><label for="test">Test</label><input id="test" type="text"></p><p>Test</p></form><p>Test2</p></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, ['Test Test Test Test ']),
            h('p', {}, ['Test2']),
            h('form', {}, [
                h('p', {}, ['Test Test ']),
                h('p', {}, [
                    h('label', { htmlFor: 'test' }, ['Test']),
                    h('input', { id: 'test', type: 'text' }, []),
                ]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p>Test Test Test Test </p><p>Test2</p><form><p>Test Test </p><p><label for="test">Test</label><input id="test" type="text"></p></form></div>'
    );
    expect(p[6]).toBe(document.activeElement);
});

test('should replace the textContent [doubleTree][patchTrees]', () => {
    const newApp = h('div', { id: 'app' }, [
        h('p', {}, [
            h('button', { key: 'count' }, [`[+] @ 0`]),
            h('button', { key: 'count-1' }, [h('span', {}, [`0 @ [-]`])]),
        ]),
    ]);
    patch(useApp(), newApp);
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p><button>[+] @ 0</button><button><span>0 @ [-]</span></button></p></div>'
    );
    const activeElement = document.querySelectorAll('button')[0];
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [
                h('button', { key: 'count' }, [`[+] @ 1`]),
                h('button', { key: 'count-1' }, [h('span', {}, [`1 @ [-]`])]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p><button>[+] @ 1</button><button><span>1 @ [-]</span></button></p></div>'
    );
    expect(p[2]).toBe(document.activeElement);
});
