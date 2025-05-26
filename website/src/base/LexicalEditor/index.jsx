import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $getRoot, $createParagraphNode, $createTextNode, TextNode, ParagraphNode } from "lexical";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import ToolbarPlugin from './plugins/ToolbarPlugin';
import "./index.less";
import MonacoEditor from "../MonacoEditor";

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
    ParagraphNode,
    TextNode,
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode
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

const LexicalEditor = () => {
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
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

    const handleEditorChange = (editorState) => {
        // Função para lidar com as mudanças do editor
    };

    function HtmlExtractorPlugin({ onHtmlChange }) {
        const [editor] = useLexicalComposerContext();

        useEffect(() => {
            // Salvar a referência do editor para uso posterior
            editorRef.current = editor;

            return editor.registerUpdateListener(() => {
                // Capturar o HTML diretamente do elemento raiz
                if (editor._rootElement) {
                    const html = editor._rootElement.innerHTML;
                    onHtmlChange(html);
                }
            });
        }, [editor, onHtmlChange]);

        return null;
    }

    const handleHtmlChange = (html) => {
        if (!isHtmlMode) {
            setHtmlContent(html);
            setHtmlEditorValue(html);
        }
    };

    const handleToggleHtmlMode = () => {
        if (isHtmlMode) {
            // Estamos saindo do modo HTML, aplicar as alterações ao Lexical
            applyHtmlToLexical(htmlEditorValue);
        }
        setIsHtmlMode(!isHtmlMode);
    };

    const handleMonacoEditorChange = (value) => {
        setHtmlEditorValue(value);
    };

    // Função para processar nós de texto com formatação
    const processTextNode = (domNode, lexicalParent) => {
        if (domNode.nodeType === Node.TEXT_NODE) {
            // Nó de texto simples
            if (domNode.textContent.trim()) {
                lexicalParent.append($createTextNode(domNode.textContent));
            }
            return;
        }
    
        // Verificar formatações
        let textNode = $createTextNode(domNode.textContent);
        
        // Aplicar formatações
        if (domNode.nodeName === 'B' || domNode.nodeName === 'STRONG') {
            textNode.toggleFormat('bold');
        }
        if (domNode.nodeName === 'I' || domNode.nodeName === 'EM') {
            textNode.toggleFormat('italic');
        }
        if (domNode.nodeName === 'U') {
            textNode.toggleFormat('underline');
        }
        
        lexicalParent.append(textNode);
    };

    // Função para processar nós com filhos
    const processNodeWithChildren = (domNode, lexicalParent) => {
        // Se o nó tem filhos, processar cada um
        if (domNode.childNodes && domNode.childNodes.length > 0) {
            Array.from(domNode.childNodes).forEach(childNode => {
                if (childNode.nodeType === Node.TEXT_NODE) {
                    // Nó de texto simples
                    if (childNode.textContent.trim()) {
                        lexicalParent.append($createTextNode(childNode.textContent));
                    }
                } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                    // Verificar formatações
                    if (childNode.nodeName === 'B' || childNode.nodeName === 'STRONG' ||
                        childNode.nodeName === 'I' || childNode.nodeName === 'EM' ||
                        childNode.nodeName === 'U') {
                        
                        let textNode = $createTextNode(childNode.textContent);
                        
                        // Aplicar formatações
                        if (childNode.nodeName === 'B' || childNode.nodeName === 'STRONG') {
                            textNode.toggleFormat('bold');
                        }
                        if (childNode.nodeName === 'I' || childNode.nodeName === 'EM') {
                            textNode.toggleFormat('italic');
                        }
                        if (childNode.nodeName === 'U') {
                            textNode.toggleFormat('underline');
                        }
                        
                        lexicalParent.append(textNode);
                    } else {
                        // Processar outros elementos aninhados recursivamente
                        processNodeWithChildren(childNode, lexicalParent);
                    }
                }
            });
        } else if (domNode.textContent.trim()) {
            // Se não tem filhos mas tem texto
            lexicalParent.append($createTextNode(domNode.textContent));
        }
    };

    // Nova função para aplicar HTML ao editor Lexical
    const applyHtmlToLexical = (html) => {
        if (!editorRef.current || !html) return;
    
        console.log('applyHtmlToLexical html', html);
    
        const editor = editorRef.current;
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, 'text/html');
        
        // Atualizar o editor com o conteúdo HTML
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            
            const bodyChildren = dom.body.children;
            
            if (bodyChildren.length === 0) {
                console.warn("Não tem conteúdo");
    
                // Se não houver conteúdo, criar um parágrafo vazio
                const paragraph = $createParagraphNode();
                root.append(paragraph);
                return;
            }
            
            // Converter elementos HTML em nós Lexical
            Array.from(bodyChildren).forEach(node => {
                console.log('node', node);
    
                if (node.nodeName === 'P') {
                    const paragraph = $createParagraphNode();
                    processNodeWithChildren(node, paragraph);
                    root.append(paragraph);
                } else if (node.nodeName.match(/^H[1-6]$/)) {
                    const level = node.nodeName.charAt(1);
                    const heading = $createHeadingNode(`h${level}`);
                    processNodeWithChildren(node, heading);
                    root.append(heading);
                } else if (node.nodeName === 'BLOCKQUOTE') {
                    const quote = $createQuoteNode();
                    processNodeWithChildren(node, quote);
                    root.append(quote);
                } else {
                    // Para outros elementos, criar um parágrafo
                    const paragraph = $createParagraphNode();
                    processNodeWithChildren(node, paragraph);
                    root.append(paragraph);
                }
            });
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <ToolbarPlugin
                    onToggleHtmlMode={handleToggleHtmlMode}
                    isHtmlMode={isHtmlMode}
                />
                <div className="editor-inner">
                    {!isHtmlMode ? (
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="editor-input" />}
                            placeholder={<div className="placeholder">Digite algum texto...</div>}
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
                    <CustomOnChangePlugin onChange={handleEditorChange} />
                    <HtmlExtractorPlugin onHtmlChange={handleHtmlChange} />
                </div>
            </div>
        </LexicalComposer>
    );
}

export default LexicalEditor;
