import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $getRoot, $createParagraphNode, $createTextNode, TextNode, ParagraphNode } from "lexical";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode, $createListNode, $createListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode, $createLinkNode } from "@lexical/link";

import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import GridLayoutPlugin from "./plugins/GridLayoutPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

import { ImageNode, $createImageNode } from "./nodes/ImageNode";
import { GridContainerNode, $createGridContainerNode } from "./nodes/GridContainerNode";
import { GridItemNode, $createGridItemNode } from "./nodes/GridItemNode";

import "./index.less";
import MonacoEditor from "../MonacoEditor";
import ToolbarPluginSimple from "./plugins/ToolbarPluginSimple";

const theme = {
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3"
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline"
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
    listitemChecked: "editor-listItemChecked",
    listitemUnchecked: "editor-listItemUnchecked",
  },
  quote: "editor-quote",
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
    "$1$2$3"
  );

  // Remove atributos data-sal (ou qualquer data-*)
  cleaned = cleaned.replace(/\s*data-sal[^=]*="[^"]*"/g, "");
  return cleaned;
};

// Tag das atualizações feitas ao carregar HTML no editor (não geram onChange)
const IMPORT_TAG = "cluar-html-import";

// Junta espaços, tabs e quebras de linha num único espaço, como o navegador faz ao renderizar
const collapseWhitespace = (text) => text.replace(/\s+/g, " ");

// Propriedades de texto de um bloco (<p>) que devem passar para o texto dentro dele
const INHERITABLE_STYLE = /^(font|color|line-height|letter-spacing|word-spacing|text-transform|text-decoration|text-shadow)/;

const parseStyle = (cssText) => {
  const element = document.createElement("span");
  element.style.cssText = cssText || "";
  return element.style;
};

// Estilo inline do próprio elemento, sem o alinhamento (que é tratado no bloco)
const getOwnTextStyle = (domNode) => {
  const style = parseStyle(domNode.getAttribute("style"));
  style.removeProperty("text-align");
  return style.cssText;
};

// Só as propriedades de texto do estilo de um bloco
const getInheritableStyle = (domNode) => {
  const source = parseStyle(domNode.getAttribute("style"));
  const target = parseStyle("");
  Array.from(source).forEach((property) => {
    if (INHERITABLE_STYLE.test(property)) {
      target.setProperty(property, source.getPropertyValue(property), source.getPropertyPriority(property));
    }
  });
  return target.cssText;
};

// Soma dois estilos inline; o segundo tem prioridade
const mergeStyles = (baseStyle, ownStyle) => {
  if (!baseStyle) return ownStyle || "";
  if (!ownStyle) return baseStyle;
  const target = parseStyle(baseStyle);
  const source = parseStyle(ownStyle);
  Array.from(source).forEach((property) => {
    target.setProperty(property, source.getPropertyValue(property), source.getPropertyPriority(property));
  });
  return target.cssText;
};

// allowHtmlMode: mostra o seletor Visual / HTML (modo HTML interno do Lexical).
// onCodeModeRequest: usado pelos editores de conteúdo que têm o próprio modo "Código"
//   (html_content). O seletor aparece igual, mas o "Código" chama esta função em vez do modo interno.
// inverted: inverte o tema do editor (claro <-> escuro) para editar textos de cor clara/escura.
const LexicalEditor = ({
  initialHtml,
  onChange,
  mode = "full",
  stripRootParagraph = false,
  allowHtmlMode = true,
  onCodeModeRequest,
  codeModeLabel,
  inverted = false,
}) => {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const themeMode = useSelector((state) => state.theme?.mode || "light");
  const isDarkEditor = (themeMode === "dark") !== inverted;
  const [htmlEditorValue, setHtmlEditorValue] = useState("");
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

      return editor.registerUpdateListener(({ tags, dirtyElements, dirtyLeaves }) => {
        // Não sobrescreve o HTML quando o conteúdo foi carregado a partir do código
        // (modo HTML → visual) nem quando só mudou a seleção/foco.
        if (tags.has(IMPORT_TAG)) return;
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

        if (editor._rootElement) {
          const clonedElement = editor._rootElement.cloneNode(true);

          const imageContainers = clonedElement.querySelectorAll(".image-container");
          imageContainers.forEach(container => {
            container.removeAttribute("class");
          });

          const selectionIndicators = clonedElement.querySelectorAll(".image-selection-indicator");
          selectionIndicators.forEach(indicator => {
            indicator.remove();
          });

          const imageResizers = clonedElement.querySelectorAll(".image-resizer");
          imageResizers.forEach(resizer => {
            resizer.remove();
          });

          // Remove div parente das imagens, mantendo apenas span e img
          const imageDivs = clonedElement.querySelectorAll("span[data-lexical-decorator=\"true\"] div");
          imageDivs.forEach(div => {
            const img = div.querySelector("img");
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
        // Remove <p> externo único, a menos que ele tenha estilo (ex.: text-align: center),
        // que seria perdido junto com ele
        let match = sanitizedHtml.match(/^<p\b([^>]*)>(.*?)<\/p>$/i);
        if (match && !/\bstyle\s*=/.test(match[1])) {
          sanitizedHtml = match[2];
        }

        // Remove headings (h1-h6) mantendo apenas seu conteúdo interno
        sanitizedHtml = sanitizedHtml.replace(
          /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi,
          "$1"
        );

        // Limpeza extra de atributos do Lexical
        sanitizedHtml = sanitizedHtml.replace(/\s*data-lexical-text="true"/g, "");
        sanitizedHtml = sanitizedHtml.replace(/\s*dir="auto"/g, "");
      }

      setHtmlEditorValue(sanitizedHtml);
      if (onChange) {
        onChange(sanitizedHtml);
      }
    }
  };

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
        if (child.nodeName.toUpperCase() === "P") {
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
        } else if (child.nodeName.toUpperCase() === "BR") {
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
  const processNodeWithChildren = (domNode, lexicalParent, inheritedStyle = "") => {
    if (!domNode) return;

    if (domNode.nodeType === Node.TEXT_NODE) {
      // Quebras de linha e indentação do código não viram texto (como no navegador)
      let text = collapseWhitespace(domNode.textContent);
      if (!domNode.previousSibling) text = text.trimStart();
      if (!domNode.nextSibling) text = text.trimEnd();
      if (text.trim()) {
        const textNode = $createTextNode(text);
        if (inheritedStyle) textNode.setStyle(inheritedStyle);
        lexicalParent.append(textNode);
      }
      return;
    }

    if (domNode.nodeType === Node.ELEMENT_NODE) {
      const tagName = domNode.nodeName.toUpperCase();
      const classList = domNode.classList;

      // Estilo inline do próprio elemento (sem text-align, que é do bloco) somado ao herdado
      const mergedStyle = mergeStyles(inheritedStyle, getOwnTextStyle(domNode));
      const styles = mergedStyle ? [mergedStyle] : [];

      // GRID CONTAINER - Detectar div com classes "section group"
      if (tagName === "DIV" && classList.contains("section") && classList.contains("group")) {
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
      if (tagName === "DIV" && classList.contains("col")) {
        // Encontrar a classe span_X_of_Y
        let columnSpan = "span_1_of_1";
        for (let className of classList) {
          if (className.startsWith("span_") && className.includes("_of_")) {
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
            if (childTag === "P" && (child.innerHTML === "<br>" || child.innerHTML === "<br/>" || child.innerHTML === "<br />")) {
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

      if (tagName === "P" && (domNode.innerHTML === "<br>" || domNode.innerHTML === "<br/>" || domNode.innerHTML === "<br />")) {
        const emptyParagraph = $createParagraphNode();
        lexicalParent.append(emptyParagraph);
        return;
      }

      // FORMAT FLAGS
      const isBold = tagName === "B" || tagName === "STRONG" || classList.contains("editor-text-bold");
      const isItalic = tagName === "I" || tagName === "EM" || classList.contains("editor-text-italic");
      const isUnderline = tagName === "U" || classList.contains("editor-text-underline");

      // LINK
      if (tagName === "A" && domNode.hasAttribute("href")) {
        const href = domNode.getAttribute("href");
        const linkNode = $createLinkNode(href);
        Array.from(domNode.childNodes).forEach(child => {
          processNodeWithChildren(child, linkNode);
        });
        lexicalParent.append(linkNode);
        return;
      }

      // Imagens
      if (tagName === "IMG") {
        const src = domNode.getAttribute("src");
        const altText = domNode.getAttribute("alt") || "";
        const width = domNode.style.width || "inherit";
        const height = domNode.style.height || "inherit";
        const maxWidthMatch = domNode.style.maxWidth?.match(/\d+/);
        const maxWidth = maxWidthMatch ? parseInt(maxWidthMatch[0]) : 500;
        const imageNode = $createImageNode({
          src, altText, width, height, maxWidth,
          showCaption: false, captionsEnabled: true
        });
        lexicalParent.append(imageNode);
        return;
      }

      if (tagName === "UL" || tagName === "OL") {
        const listType = tagName === "UL" ? "bullet" : "number";
        const listNode = $createListNode(listType);
        Array.from(domNode.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE && child.nodeName.toUpperCase() === "LI") {
            const listItemNode = $createListItemNode();
            Array.from(child.childNodes).forEach(grandChild => {
              processNodeWithChildren(grandChild, listItemNode);
            });
            listNode.append(listItemNode);
          }
        });
        if (lexicalParent.getType && lexicalParent.getType() === "paragraph") {
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
        const text = collapseWhitespace(domNode.firstChild.textContent);
        const textNode = $createTextNode(text);
        if (isBold) textNode.toggleFormat("bold");
        if (isItalic) textNode.toggleFormat("italic");
        if (isUnderline) textNode.toggleFormat("underline");
        if (styles.length > 0) {
          textNode.setStyle(styles.join("; "));
        }
        lexicalParent.append(textNode);
        return;
      }

      // Children Node
      Array.from(domNode.childNodes).forEach(child => {
        processNodeWithChildren(child, lexicalParent, mergedStyle);
      });
    }
  };

  // Remove cores "default" (preto) do HTML antes de converter para Lexical.
  // Feito no DOM já parseado: uma regex no texto cortava o style em valores com aspas
  // (ex.: font-family: 'Space Grotesk').
  function cleanDomDefaultColors(dom) {
    dom.body.querySelectorAll("[style]").forEach((element) => {
      const color = element.style.color.toLowerCase().replace(/\s+/g, "");
      if (["black", "#000", "#000000", "rgb(0,0,0)"].includes(color)) {
        element.style.removeProperty("color");
      }
      if (!element.getAttribute("style")?.trim()) {
        element.removeAttribute("style");
      }
    });
  }

  // Nova função para aplicar HTML ao editor Lexical
  const applyHtmlToLexical = (html) => {
    if (!editorRef.current || !html) return;

    const editor = editorRef.current;
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    // 👇 LIMPA as cores padrão antes de converter para Lexical
    cleanDomDefaultColors(dom);

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
          const text = collapseWhitespace(node.textContent).trim();
          if (text) {
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

        if (tag === "DIV" && classList.contains("section") && classList.contains("group")) {
          // Extrair informações das colunas
          const columns = [];
          Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              const childTag = child.nodeName.toUpperCase();
              const childClassList = child.classList;
              if (childTag === "DIV" && childClassList.contains("col")) {
                let columnSpan = "span_1_of_1";
                for (let className of childClassList) {
                  if (className.startsWith("span_") && className.includes("_of_")) {
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
              child.nodeName.toUpperCase() === "DIV" &&
              child.classList.contains("col") &&
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

        if (tag === "P") {
          lexicalNode = $createParagraphNode();
          if (node.innerHTML === "<br>" || node.innerHTML === "<br/>" || node.innerHTML === "<br />") {
            root.append(lexicalNode);
            return;
          }
        } else if (tag.startsWith("H") && tag.length === 2 && !isNaN(tag[1])) {
          lexicalNode = $createHeadingNode(tag.toLowerCase());
          // Processa filhos SEM criar parágrafos – o texto vai direto para o heading
          Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
              lexicalNode.append($createTextNode(child.textContent));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const childTag = child.nodeName.toUpperCase();
              if (childTag === "P") {
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
        } else if (tag === "BLOCKQUOTE") {
          lexicalNode = $createQuoteNode();
        } else if (tag === "UL" || tag === "OL") {
          const listType = tag === "UL" ? "bullet" : "number";
          lexicalNode = $createListNode(listType);
          Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE && child.nodeName.toUpperCase() === "LI") {
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
        if (textAlign && textAlign !== "start" && textAlign !== "left") {
          lexicalNode.setFormat(textAlign);
        }

        if (tag === "P" || tag === "BLOCKQUOTE") {
          // Estilos de texto do bloco (font-size, color...) passam para o texto dentro dele
          Array.from(node.childNodes).forEach((child) => {
            processNodeWithChildren(child, lexicalNode, getInheritableStyle(node));
          });
        } else {
          processNodeWithChildren(node, lexicalNode);
        }
        root.append(lexicalNode);
      });
    }, { tag: IMPORT_TAG });
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`editor-container editor-container--${isDarkEditor ? "dark" : "light"}`}>
        {mode == "full" ? (
          <ToolbarPlugin
            onToggleHtmlMode={onCodeModeRequest || handleToggleHtmlMode}
            isHtmlMode={isHtmlMode}
            showModeSwitch={allowHtmlMode || !!onCodeModeRequest}
            codeLabel={codeModeLabel}
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
              contentEditable={
                <ContentEditable
                  className={mode == "full" ? "editor-input" : "editor-input__simple"}
                  // No Chrome, o corretor ortográfico impede o texto em gradiente de aparecer
                  // nas palavras marcadas; em títulos (texto curto, nomes de marca) fica desligado
                  spellCheck={!stripRootParagraph}
                />
              }
              placeholder={mode == "full" ?
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
