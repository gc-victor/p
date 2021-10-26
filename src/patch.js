import { patchTrees } from './patch-trees.js';
import { doubleTree } from './doubleTree.js';

export function patch(a, b) {
    if (!b) {
        a.parentNode.removeChild(a);
        return b;
    }

    const parentNode = a.parentNode;

    let activeElement = document.activeElement;

    if (activeElement && activeElement.tagName !== 'BODY' && a.contains(activeElement)) {
        const { p, n, pAncestry, nActiveElement, nAncestry } = doubleTree(a, b, activeElement);
        if (!nActiveElement) {
            parentNode.replaceChild(b, a);
        } else {
            patchTrees(n, p, pAncestry, nAncestry);
            return a;
        }
    } else {
        parentNode.replaceChild(b, a);
    }

    return b;
}
