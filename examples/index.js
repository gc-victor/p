import p from './src/index.js';
import t from './t.js';

let count = 0;

const increment = () => {
    count = count + 1;
    p(document.getElementById('app'), index());
};
const decrement = () => {
    count = count - 1;
    p(document.getElementById('app'), index());
};
const add = (ev) => {
    count = Number(ev.target.value);
    p(document.getElementById('app'), index());
};

const index = () => {
    return t`
        <div id="app">
            <h1>Counter</h1>
            <button onclick="${increment}">+</button>
            <input oninput="${add}" name="input" type="number" value="${count}" />
            ${t`<button onclick="${decrement}">-</button>`}
        </div>
    `;
};

p(document.getElementById('app'), index());
