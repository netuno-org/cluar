import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $getRoot, $createParagraphNode, $createTextNode, TextNode, ParagraphNode } from "lexical";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode, $createListNode, $createListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode, $createLinkNode } from "@lexical/link";

import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import GridLayoutPlugin from "./plugins/GridLayoutPlugin";
import ImagesPlugin from './plugins/ImagesPlugin';
import ToolbarPlugin from "./plugins/ToolbarPlugin";

import { ImageNode, $createImageNode } from './nodes/ImageNode';
import { GridContainerNode, $createGridContainerNode } from './nodes/GridContainerNode';
import { GridItemNode, $createGridItemNode } from './nodes/GridItemNode';

import "./index.less";
import MonacoEditor from "../MonacoEditor";
import ToolbarPluginSimple from "./plugins/ToolbarPluginSimple";

const theme = {
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3'
    },
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline'
    },
    list: {
        nested: {
            listitem: 'editor-nested-listitem',
        },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listItem',
        listitemChecked: 'editor-listItemChecked',
        listitemUnchecked: 'editor-listItemUnchecked',
    },
    quote: 'editor-quote',
};

const editorNodes = [
    AutoLinkNode,
    HeadingNode,
    GridContainerNode,
    GridItemNode,
    ImageNode,
    LinkNode,
    ListNode,
    ListItemNode,
    ParagraphNode,
    QuoteNode,
    TextNode
];

function CustomOnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [onChange, editor]);
    return null;
}

const cleanHeadingsAndAttrs = (html) => {
    // Remove <p> imediatamente dentro de qualquer <h1>...<h6>
    let cleaned = html.replace(
        /(<h[1-6][^>]*>)\s*<p[^>]*>(.*?)<\/p>\s*(<\/h[1-6]>)/gi,
        '$1$2$3'
    );

    // Remove atributos data-sal (ou qualquer data-*)
    cleaned = cleaned.replace(/\s*data-sal[^=]*="[^"]*"/g, '');
    return cleaned;
};

const LexicalEditor = ({ initialHtml, onChange, mode = "full", stripRootParagraph = false }) => {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlEditorValue, setHtmlEditorValue] = useState('');
    const editorRef = useRef(null);

    const initialConfig = {
        namespace: "My Editor",
        theme,
        onError(error) {
            console.error("Erro no editor Lexical:", error);
        },
        nodes: editorNodes
    };

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (initialHtml && editorRef.current && isFirstRender.current) {
            applyHtmlToLexical(initialHtml);
            setHtmlEditorValue(initialHtml);
            isFirstRender.current = false;
        }
    }, [initialHtml]);

    const handleEditorChange = (editorState) => {
        // Função para lidar com as mudanças do editor
    };

    function HtmlExtractorPlugin({ onHtmlChange }) {
        const [editor] = useLexicalComposerContext();

        useEffect(() => {
            editorRef.current = editor;

            return editor.registerUpdateListener(() => {
                if (editor._rootElement) {
                    const clonedElement = editor._rootElement.cloneNode(true);

                    const imageContainers = clonedElement.querySelectorAll('.image-container');
                    imageContainers.forEach(container => {
                        container.removeAttribute('class');
                    });

                    const selectionIndicators = clonedElement.querySelectorAll('.image-selection-indicator');
                    selectionIndicators.forEach(indicator => {
                        indicator.remove();
                    });

                    const imageResizers = clonedElement.querySelectorAll('.image-resizer');
                    imageResizers.forEach(resizer => {
                        resizer.remove();
                    });

                    // Remove div parente das imagens, mantendo apenas span e img
                    const imageDivs = clonedElement.querySelectorAll('span[data-lexical-decorator="true"] div');
                    imageDivs.forEach(div => {
                        const img = div.querySelector('img');
                        if (img) {
                            div.parentNode.insertBefore(img, div);
                            div.remove();
                        }
                    });

                    const html = clonedElement.innerHTML;
                    onHtmlChange(html);
                }
            });
        }, [editor, onHtmlChange]);

        return null;
    }

    const handleHtmlChange = (html) => {
        if (!isHtmlMode) {
            let sanitizedHtml = cleanHeadingsAndAttrs(html);

            if (stripRootParagraph) {
                // Remove <p> externo único (com ou sem atributos)
                let match = sanitizedHtml.match(/^<p\b[^>]*>(.*?)<\/p>$/i);
                if (match) {
                    sanitizedHtml = match[1];
                }

                // Remove headings (h1-h6) mantendo apenas seu conteúdo interno
                sanitizedHtml = sanitizedHtml.replace(
                    /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi,
                    '$1'
                );

                // Limpeza extra de atributos do Lexical
                sanitizedHtml = sanitizedHtml.replace(/\s*data-lexical-text="true"/g, '');
                sanitizedHtml = sanitizedHtml.replace(/\s*dir="auto"/g, '');
            }

            setHtmlEditorValue(sanitizedHtml);
            if (onChange) {
                onChange(sanitizedHtml);
            }
        }
    };

    // ─── Toggle INTERNO do Lexical (visualizar código gerado pelo editor) ───
    // Continua funcionando normalmente. Não é o modo HTML Puro externo.
    const handleToggleHtmlMode = () => {
        if (isHtmlMode) {
            applyHtmlToLexical(htmlEditorValue);
        }
        setIsHtmlMode(!isHtmlMode);
    };

    const handleMonacoEditorChange = (value) => {
        setHtmlEditorValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    const processGridItemContent = (htmlNode, lexicalParent) => {
        Array.from(htmlNode.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                const paragraphNode = $createParagraphNode();
                const textNode = $createTextNode(child.textContent);
                paragraphNode.append(textNode);
                lexicalParent.append(paragraphNode);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.nodeName.toUpperCase() === 'P') {
                    const paragraphNode = $createParagraphNode();
                    Array.from(child.childNodes).forEach(grandChild => {
                        if (grandChild.nodeType === Node.TEXT_NODE && grandChild.textContent.trim()) {
                            const textNode = $createTextNode(grandChild.textContent);
                            paragraphNode.append(textNode);
                        } else if (grandChild.nodeType === Node.ELEMENT_NODE) {
                            processNodeWithChildren(grandChild, paragraphNode);
                        }
                    });
                    lexicalParent.append(paragraphNode);
                } else if (child.nodeName.toUpperCase() === 'BR') {
                    const emptyParagraph = $createParagraphNode();
                    lexicalParent.append(emptyParagraph);
                } else {
                    // Outros elementos (img, span decorators, etc.) - processar normalmente
                    processNodeWithChildren(child, lexicalParent);
                }
            }
        });
    };

    // Função para processar nós com filhos
    const processNodeWithChildren = (domNode, lexicalParent) => {
        if (!domNode) return;

        if (domNode.nodeType === Node.TEXT_NODE) {
            const text = domNode.textContent;
            if (text.trim()) {
                const textNode = $createTextNode(text);
                lexicalParent.append(textNode);
            }
            return;
        }

        if (domNode.nodeType === Node.ELEMENT_NODE) {
            const tagName = domNode.nodeName.toUpperCase();
            const classList = domNode.classList;
            const styles = [];

            const computedStyle = window.getComputedStyle(domNode);
            let color = domNode.style.color || computedStyle.color;
            const backgroundColor = domNode.style.backgroundColor || computedStyle.backgroundColor;
            const fontFamilyRaw = domNode.style.fontFamily || computedStyle.fontFamily || '';
            const fontFamily = fontFamilyRaw.replace(/^['"]+|['"]+$/g, '');
            const fontSize = domNode.style.fontSize || computedStyle.fontSize;
            const textAlign = domNode.style.textAlign || computedStyle.textAlign;

            if (color) {
                const normalized = color.toLowerCase().replace(/\s+/g, '');
                if (
                    normalized === 'rgb(0,0,0)' ||
                    normalized === 'black' ||
                    normalized === '#000' ||
                    normalized === '#000000'
                ) {
                    color = null; // Não aplique cor padrão
                }
            }
            if (color) styles.push(`color: ${color}`);
            if (backgroundColor) styles.push(`background-color: ${backgroundColor}`);
            if (fontFamily) styles.push(`font-family: ${fontFamily}`);
            if (fontSize) styles.push(`font-size: ${fontSize}`);
            if (textAlign && textAlign !== 'start' && textAlign !== 'left') styles.push(`text-align: ${textAlign}`);

            // GRID CONTAINER - Detectar div com classes "section group"
            if (tagName === 'DIV' && classList.contains('section') && classList.contains('group')) {
                const gridContainerNode = $createGridContainerNode();
                // Processar filhos que devem ser grid items
                Array.from(domNode.childNodes).forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        processNodeWithChildren(child, gridContainerNode);
                    }
                });
                lexicalParent.append(gridContainerNode);
                return;
            }

            // GRID ITEM - Detectar div com classes "col span_X_of_Y"
            if (tagName === 'DIV' && classList.contains('col')) {
                // Encontrar a classe span_X_of_Y
                let columnSpan = 'span_1_of_1';
                for (let className of classList) {
                    if (className.startsWith('span_') && className.includes('_of_')) {
                        columnSpan = className;
                        break;
                    }
                }
                const gridItemNode = $createGridItemNode(columnSpan);
                // Processar conteúdo do grid item
                Array.from(domNode.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                        const paragraphNode = $createParagraphNode();
                        const textNode = $createTextNode(child.textContent);
                        paragraphNode.append(textNode);
                        gridItemNode.append(paragraphNode);
                    } else if (child.nodeType === Node.ELEMENT_NODE) {
                        const childTag = child.nodeName.toUpperCase();
                        if (childTag === 'P' && (child.innerHTML === '<br>' || child.innerHTML === '<br/>' || child.innerHTML === '<br />')) {
                            const emptyParagraph = $createParagraphNode();
                            gridItemNode.append(emptyParagraph);
                        } else {
                            processNodeWithChildren(child, gridItemNode);
                        }
                    }
                });
                lexicalParent.append(gridItemNode);
                return;
            }

            if (tagName === 'P' && (domNode.innerHTML === '<br>' || domNode.innerHTML === '<br/>' || domNode.innerHTML === '<br />')) {
                const emptyParagraph = $createParagraphNode();
                lexicalParent.append(emptyParagraph);
                return;
            }

            // FORMAT FLAGS
            const isBold = tagName === 'B' || tagName === 'STRONG' || classList.contains('editor-text-bold');
            const isItalic = tagName === 'I' || tagName === 'EM' || classList.contains('editor-text-italic');
            const isUnderline = tagName === 'U' || classList.contains('editor-text-underline');

            // LINK
            if (tagName === 'A' && domNode.hasAttribute('href')) {
                const href = domNode.getAttribute('href');
                const linkNode = $createLinkNode(href);
                Array.from(domNode.childNodes).forEach(child => {
                    processNodeWithChildren(child, linkNode);
                });
                lexicalParent.append(linkNode);
                return;
            }

            // Imagens
            if (tagName === 'IMG') {
                const src = domNode.getAttribute('src');
                const altText = domNode.getAttribute('alt') || '';
                const width = domNode.style.width || 'inherit';
                const height = domNode.style.height || 'inherit';
                const maxWidthMatch = domNode.style.maxWidth?.match(/\d+/);
                const maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[0]) : 500;
                const imageNode = $createImageNode({
                    src, altText, width, height, maxWidth,
                    showCaption: false, captionsEnabled: true
                });
                lexicalParent.append(imageNode);
                return;
            }

            if (tagName === 'UL' || tagName === 'OL') {
                const listType = tagName === 'UL' ? 'bullet' : 'number';
                const listNode = $createListNode(listType);
                Array.from(domNode.childNodes).forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE && child.nodeName.toUpperCase() === 'LI') {
                        const listItemNode = $createListItemNode();
                        Array.from(child.childNodes).forEach(grandChild => {
                            processNodeWithChildren(grandChild, listItemNode);
                        });
                        listNode.append(listItemNode);
                    }
                });
                if (lexicalParent.getType && lexicalParent.getType() === 'paragraph') {
                    const grandParent = lexicalParent.getParent();
                    if (grandParent) {
                        lexicalParent.insertAfter(listNode);
                        // Verificar se o parágrafo ainda tem pai antes de remover
                        if (lexicalParent.getChildrenSize() === 0 && lexicalParent.getParent()) {
                            lexicalParent.remove();
                        }
                    } else {
                        // Se não há grandParent, adicionar a lista diretamente ao pai
                        lexicalParent.append(listNode);
                    }
                } else {
                    lexicalParent.append(listNode);
                }
                return;
            }

            // Span e outros elementos
            if (domNode.childNodes.length === 1 &&
                domNode.firstChild.nodeType === Node.TEXT_NODE &&
                domNode.firstChild.textContent
            ) {
                const text = domNode.firstChild.textContent;
                const textNode = $createTextNode(text);
                if (isBold) textNode.toggleFormat('bold');
                if (isItalic) textNode.toggleFormat('italic');
                if (isUnderline) textNode.toggleFormat('underline');
                if (styles.length > 0) {
                    textNode.setStyle(styles.join('; '));
                }
                lexicalParent.append(textNode);
                return;
            }

            // Children Node
            Array.from(domNode.childNodes).forEach(child => {
                processNodeWithChildren(child, lexicalParent);
            });
        }
    };

    // Remove cores "default" do HTML antes de converter para Lexical
    function cleanHtmlDefaultColors(html) {
        return html.replace(/(<[^>]+style\s*=\s*["'])([^"']*)["']/gi, (match, prefix, styleAttr) => {
            // Remove regras de cor que sejam "padrão"
            const cleanedStyle = styleAttr
                .split(';')
                .filter(rule => {
                    const trimmed = rule.trim();
                    if (!trimmed.startsWith('color:')) return true;
                    // Normaliza a cor para comparação
                    const colorValue = trimmed.substring(6).trim().toLowerCase();
                    return !(
                        colorValue === 'black' ||
                        colorValue === '#000' ||
                        colorValue === '#000000' ||
                        colorValue === 'rgb(0, 0, 0)' ||
                        colorValue === 'rgb(0,0,0)'
                    );
                })
                .join(';')
                .trim();

            if (cleanedStyle) {
                return `${prefix}${cleanedStyle}"`;
            } else {
                // Se não sobrou estilo, remove o atributo style inteiro
                return match.replace(/\s+style\s*=\s*["'][^"']*["']/, '');
            }
        });
    }

    // Nova função para aplicar HTML ao editor Lexical
    const applyHtmlToLexical = (html) => {
        if (!editorRef.current || !html) return;

        const editor = editorRef.current;
        const parser = new DOMParser();
        // 👇 LIMPA as cores padrão ANTES de parsear o HTML
        const cleanedHtml = cleanHtmlDefaultColors(html);
        const dom = parser.parseFromString(cleanedHtml, 'text/html');

        editor.update(() => {
            const root = $getRoot();
            root.clear();

            const bodyNodes = dom.body.childNodes; // childNodes inclui texto e elementos

            if (bodyNodes.length === 0) {
                root.append($createParagraphNode());
                return;
            }

            Array.from(bodyNodes).forEach((node) => {
                // 1. Trata nós de texto (ex.: "Slider" puro)
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (text.trim()) {
                        const paragraph = $createParagraphNode();
                        paragraph.append($createTextNode(text));
                        root.append(paragraph);
                    }
                    return;
                }

                // 2. Ignora outros nós que não sejam elementos
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                let lexicalNode;
                const tag = node.nodeName.toUpperCase();
                const classList = node.classList;

                if (tag === 'DIV' && classList.contains('section') && classList.contains('group')) {
                    // Extrair informações das colunas
                    const columns = [];
                    Array.from(node.childNodes).forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            const childTag = child.nodeName.toUpperCase();
                            const childClassList = child.classList;
                            if (childTag === 'DIV' && childClassList.contains('col')) {
                                let columnSpan = 'span_1_of_1';
                                for (let className of childClassList) {
                                    if (className.startsWith('span_') && className.includes('_of_')) {
                                        columnSpan = className;
                                        break;
                                    }
                                }
                                columns.push(columnSpan);
                            }
                        }
                    });

                    const container = $createGridContainerNode();
                    const itemsCount = columns.length;
                    for (let i = 0; i < itemsCount; i++) {
                        const columnClass = Array.isArray(columns) ? columns[i] : undefined;
                        const itemNode = $createGridItemNode(columnClass);
                        container.append(itemNode.append($createParagraphNode()));
                    }
                    root.append(container);

                    const gridItems = container.getChildren();
                    let itemIndex = 0;
                    Array.from(node.childNodes).forEach(child => {
                        if (
                            child.nodeType === Node.ELEMENT_NODE &&
                            child.nodeName.toUpperCase() === 'DIV' &&
                            child.classList.contains('col') &&
                            itemIndex < gridItems.length
                        ) {
                            const gridItem = gridItems[itemIndex];
                            gridItem.clear();
                            processGridItemContent(child, gridItem);
                            if (gridItem.getChildrenSize() === 0) {
                                gridItem.append($createParagraphNode());
                            }
                            itemIndex++;
                        }
                    });
                    return;
                }

                if (tag === 'P') {
                    lexicalNode = $createParagraphNode();
                    if (node.innerHTML === '<br>' || node.innerHTML === '<br/>' || node.innerHTML === '<br />') {
                        root.append(lexicalNode);
                        return;
                    }
                } else if (tag.startsWith('H') && tag.length === 2 && !isNaN(tag[1])) {
                    lexicalNode = $createHeadingNode(tag.toLowerCase());
                    // Processa filhos SEM criar parágrafos – o texto vai direto para o heading
                    Array.from(node.childNodes).forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            lexicalNode.append($createTextNode(child.textContent));
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            const childTag = child.nodeName.toUpperCase();
                            if (childTag === 'P') {
                                // Ignora o <p> e insere seu conteúdo diretamente no heading
                                Array.from(child.childNodes).forEach(grandChild => {
                                    processNodeWithChildren(grandChild, lexicalNode);
                                });
                            } else {
                                processNodeWithChildren(child, lexicalNode);
                            }
                        }
                    });
                    root.append(lexicalNode);
                    return;
                } else if (tag === 'BLOCKQUOTE') {
                    lexicalNode = $createQuoteNode();
                } else if (tag === 'UL' || tag === 'OL') {
                    const listType = tag === 'UL' ? 'bullet' : 'number';
                    lexicalNode = $createListNode(listType);
                    Array.from(node.childNodes).forEach(child => {
                        if (child.nodeType === Node.ELEMENT_NODE && child.nodeName.toUpperCase() === 'LI') {
                            const listItemNode = $createListItemNode();
                            Array.from(child.childNodes).forEach(grandChild => {
                                processNodeWithChildren(grandChild, listItemNode);
                            });
                            lexicalNode.append(listItemNode);
                        }
                    });
                    root.append(lexicalNode);
                    return;
                } else {
                    lexicalNode = $createParagraphNode();
                }

                const computedStyle = window.getComputedStyle(node);
                const textAlign = node.style.textAlign || computedStyle.textAlign;
                if (textAlign && textAlign !== 'start' && textAlign !== 'left') {
                    lexicalNode.setFormat(textAlign);
                }

                processNodeWithChildren(node, lexicalNode);
                root.append(lexicalNode);
            });
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                {mode == 'full' ? (
                    <ToolbarPlugin
                        onToggleHtmlMode={handleToggleHtmlMode}
                        isHtmlMode={isHtmlMode}
                    />
                ) : (
                    <ToolbarPluginSimple
                        onToggleHtmlMode={handleToggleHtmlMode}
                        isHtmlMode={isHtmlMode}
                    />
                )}
                <div className="editor-inner">
                    {!isHtmlMode ? (
                        <RichTextPlugin
                            contentEditable={<ContentEditable className={mode == 'full' ? "editor-input" : 'editor-input__simple'} />}
                            placeholder={mode == 'full' ?
                                (<div className="placeholder">Digite algum texto...</div>) :
                                (<div className="placeholder">Digite o Título...</div>)}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    ) : (
                        <MonacoEditor
                            value={htmlEditorValue}
                            onChange={handleMonacoEditorChange}
                        />
                    )}
                    <HistoryPlugin />
                    <CheckListPlugin />
                    <LinkPlugin />
                    <AutoLinkPlugin />
                    <ImagesPlugin />
                    <GridLayoutPlugin />
                    <CustomOnChangePlugin onChange={handleEditorChange} />
                    <HtmlExtractorPlugin onHtmlChange={handleHtmlChange} />
                </div>
            </div>
        </LexicalComposer>
    );
}

export default LexicalEditor;
