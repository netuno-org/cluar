import {
    $applyNodeReplacement,
    createEditor,
    DecoratorNode,
    LineBreakNode,
    ParagraphNode,
    RootNode,
    TextNode,
} from 'lexical';

import { HashtagNode } from '@lexical/hashtag';
import { LinkNode } from '@lexical/link';

import React, { lazy } from 'react';

const ImageComponent = lazy(() => import('./ImageComponent'));

function $convertImageElement(domNode) {
    const img = domNode;
    if (img.src.startsWith('file:///')) {
        return null;
    }
    const { alt: altText, src, width, height } = img;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
}

class ImageNode extends DecoratorNode {
    constructor(
        src,
        altText,
        maxWidth,
        width = 'inherit',
        height = 'inherit',
        showCaption = false,
        caption,
        captionsEnabled = true,
        key
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__maxWidth = maxWidth;
        this.__width = width;
        this.__height = height;
        this.__showCaption = showCaption;
        this.__caption =
            caption ||
            createEditor({
                namespace: 'Playground/ImageNodeCaption',
                nodes: [
                    RootNode,
                    TextNode,
                    LineBreakNode,
                    ParagraphNode,
                    LinkNode,
                    HashtagNode
                ],
            });
        this.__captionsEnabled = captionsEnabled;
    }

    static getType() {
        return 'image';
    }

    static clone(node) {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__maxWidth,
            node.__width,
            node.__height,
            node.__showCaption,
            node.__caption,
            node.__captionsEnabled,
            node.__key
        );
    }

    static importJSON(serializedNode) {
        const { altText, height, width, maxWidth, src, showCaption } = serializedNode;
        return $createImageNode({
            altText,
            height,
            maxWidth,
            showCaption,
            src,
            width,
        }).updateFromJSON(serializedNode);
    }

    updateFromJSON(serializedNode) {
        const node = super.updateFromJSON(serializedNode);
        const { caption } = serializedNode;

        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }

    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }

    static importDOM() {
        return {
            img: (node) => ({
                conversion: $convertImageElement,
                priority: 0,
            }),
        };
    }

    exportJSON() {
        return {
            ...super.exportJSON(),
            altText: this.getAltText(),
            caption: this.__caption.toJSON(),
            height: this.__height === 'inherit' ? 0 : this.__height,
            maxWidth: this.__maxWidth,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }

    setWidthAndHeight(width, height) {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }

    setShowCaption(showCaption) {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }

    createDOM(config) {
        const span = document.createElement('span');
        const className = config.theme?.image;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }

    updateDOM() {
        return false;
    }

    getSrc() {
        return this.__src;
    }

    getAltText() {
        return this.__altText;
    }

    decorate() {
        return (
            <ImageComponent
                src={this.__src}
                altText={this.__altText}
                width={this.__width}
                height={this.__height}
                maxWidth={this.__maxWidth}
                nodeKey={this.getKey()}
                showCaption={this.__showCaption}
                caption={this.__caption}
                captionsEnabled={this.__captionsEnabled}
                resizable={true}
            />
        );
    }
}

function $createImageNode({
    altText,
    height,
    maxWidth = 500,
    captionsEnabled,
    src,
    width,
    showCaption,
    caption,
    key,
}) {
    /*console.log("[ImageNode] Creating with props:", {
        altText,
        src,
        width,
        height,
        maxWidth,
        showCaption,
        caption,
        captionsEnabled,
        key,
    });*/
    return $applyNodeReplacement(
        new ImageNode(
            src,
            altText,
            maxWidth,
            width,
            height,
            showCaption,
            caption,
            captionsEnabled,
            key
        )
    );
}

function $isImageNode(node) {
    return node instanceof ImageNode;
}

export {
    ImageNode,
    $createImageNode,
    $isImageNode
};
