import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $getRoot, $createParagraphNode, $createTextNode, TextNode, ParagraphNode } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

import ToolbarPlugin from './plugins/ToolbarPlugin';
import "./index.less";
import LexicalEditor from "../LexicalEditor";

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

function onError(error) {
    console.error(error);
}

function CustomOnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [onChange, editor]);
    return null;
}

// Componente para extrair o HTML do editor
function HtmlExtractorPlugin({ onHtmlChange }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
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

const TesteEditor = () => {
    const initialConfig = {
        namespace: "My Editor",
        theme,
        onError,
        nodes: editorNodes
    };

    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [htmlContent, setHtmlContent] = useState('');
    const [htmlEditorValue, setHtmlEditorValue] = useState('');

    const handleEditorChange = (editorState) => {
        // Função para lidar com as mudanças do editor
        // Você pode adicionar lógica adicional aqui se necessário
        //console.log('Editor state changed:', editorState);
    };

    const handleToggleHtmlMode = () => {
        if (isHtmlMode) {
            // Estamos saindo do modo HTML, salvar as alterações
            setHtmlContent(htmlEditorValue);
        }
        setIsHtmlMode(!isHtmlMode);
    };

    const handleHtmlChange = (html) => {
        if (!isHtmlMode) {
            setHtmlContent(html);
            setHtmlEditorValue(html);
        }
    };

    const handleHtmlEditorChange = (e) => {
        const newHtml = e.target.value;
        setHtmlEditorValue(newHtml);
    };

    return (
        <div className="editor-wrapper">
            <LexicalEditor />
        </div>
    );
};

export default TesteEditor;