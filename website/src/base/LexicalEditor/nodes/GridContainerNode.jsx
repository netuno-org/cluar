import { addClassNamesToElement } from '@lexical/utils';
import { ElementNode } from 'lexical';

import './GridContainerNode.less';

function $convertGridContainerElement(domNode) {
    if (domNode.classList.contains('section') && domNode.classList.contains('group')) {
        const node = $createGridContainerNode();
        return { node };
    }
    return null;
}

export class GridContainerNode extends ElementNode {
    constructor(key) {
        super(key);
    }

    static getType() {
        return 'grid-container';
    }

    static clone(node) {
        return new GridContainerNode(node.__key);
    }

    isInline() {
        return false;
    }

    canBeEmpty() {
        return false;
    }

    canContainType(type) {
        return true;
    }

    createDOM(config) {
        const dom = document.createElement('div');
        dom.className = 'section group';
        if (typeof config.theme.layoutContainer === 'string') {
            addClassNamesToElement(dom, config.theme.layoutContainer);
        }
        return dom;
    }

    exportDOM() {
        const element = document.createElement('div');
        element.className = 'section group';
        element.setAttribute('data-lexical-grid-container', 'true');
        return { element };
    }

    updateDOM(prevNode, dom) {
        return false;
    }

    static importDOM() {
        return {
            div: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-grid-container') && 
                    !(domNode.classList.contains('section') && domNode.classList.contains('group'))) {
                    return null;
                }
                return {
                    conversion: $convertGridContainerElement,
                    priority: 2,
                };
            },
        };
    }

    static importJSON(json) {
        return $createGridContainerNode().updateFromJSON(json);
    }

    updateFromJSON(serializedNode) {
        return super.updateFromJSON(serializedNode);
    }

    isShadowRoot() {
        return true;
    }

    canBeEmpty() {
        return false;
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
        };
    }
}

export function $createGridContainerNode() {
    return new GridContainerNode();
}

export function $isLayoutContainerNode(node) {
    return node instanceof GridContainerNode;
}

export { GridContainerNode as LayoutContainerNode };
