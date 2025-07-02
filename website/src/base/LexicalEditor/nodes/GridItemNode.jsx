import { addClassNamesToElement } from '@lexical/utils';
import {ElementNode} from 'lexical';

import './GridItemNode.less'

function $convertGridItemElement(domNode) {
  if (domNode.classList.contains('col')) {
    // Extrair a classe de span para determinar o tamanho da coluna
    const classList = Array.from(domNode.classList);
    const spanClass = classList.find(cls => cls.startsWith('span_'));
    const columnSpan = spanClass ? spanClass : 'span_1_of_1';
    return {node: $createGridItemNode(columnSpan)};
  }
  return null;
}

export class GridItemNode extends ElementNode {
  constructor(columnSpan = 'span_1_of_1', key) {
    super(key);
    this.__columnSpan = columnSpan;
  }

  static getType() {
    return 'grid-item';
  }

  static clone(node) {
    return new GridItemNode(node.__columnSpan, node.__key);
  }

  canInsertParagraph() {
    return true;
  }

  canBeEmpty() {
    return false;
  }

  canIndent() {
    return false;
  }

  isInline() {
    return false;
  }

  canContainType(type) {
    return true;
  }

  createDOM(config) {
    const dom = document.createElement('div');
    dom.className = `col ${this.__columnSpan}`;
    dom.setAttribute('data-lexical-grid-item', 'true');
    if (typeof config.theme.layoutItem === 'string') {
      addClassNamesToElement(dom, config.theme.layoutItem);
    }
    return dom;
  }

  exportDOM() {
    const element = document.createElement('div');
    element.className = `col ${this.__columnSpan}`;
    element.setAttribute('data-lexical-grid-item', 'true');
    return { element };
  }

  updateDOM(prevNode, dom) {
    if (prevNode.__columnSpan !== this.__columnSpan) {
      dom.className = `col ${this.__columnSpan}`;
    }
    return false;
  }

  static importDOM() {
    return {
      div: (domNode) => {
        if (!domNode.hasAttribute('data-lexical-grid-item') && 
            !domNode.classList.contains('col')) {
          return null;
        }
        return {
          conversion: $convertGridItemElement,
          priority: 2,
        };
      },
    };
  }

  static importJSON(serializedNode) {
    return $createGridItemNode(serializedNode.columnSpan).updateFromJSON(serializedNode);
  }

  updateFromJSON(serializedNode) {
    return super.updateFromJSON(serializedNode);
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      columnSpan: this.__columnSpan,
    };
  }

  getColumnSpan() {
    return this.getLatest().__columnSpan;
  }

  setColumnSpan(columnSpan) {
    const self = this.getWritable();
    self.__columnSpan = columnSpan;
    return self;
  }

  isShadowRoot() {
    return true;
  }
}

export function $createGridItemNode(columnSpan = 'span_1_of_1') {
  return new GridItemNode(columnSpan);
}

export function $createLayoutItemNode(columnSpan = 'span_1_of_1') {
  return new GridItemNode(columnSpan);
}

export function $isLayoutItemNode(node) {
  return node instanceof GridItemNode;
}

export { GridItemNode as LayoutItemNode };
