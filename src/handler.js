export function handler(ev) {
    ev.currentTarget.__handler__[ev.type](ev);
}
