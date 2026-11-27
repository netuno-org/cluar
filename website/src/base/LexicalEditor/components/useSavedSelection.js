import { useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $setSelection } from "lexical";

// Guarda a seleção do editor antes de o foco ir para um campo da toolbar
// (input, color picker...) e restaura-a antes de aplicar um estilo.
export default function useSavedSelection() {
  const [editor] = useLexicalComposerContext();
  const savedSelection = useRef(null);

  const save = () => {
    savedSelection.current = editor.getEditorState().read(() => {
      const selection = $getSelection();
      return selection ? selection.clone() : null;
    });
  };

  const restore = () => {
    if (!savedSelection.current) return;
    editor.update(() => {
      $setSelection(savedSelection.current.clone());
    }, { discrete: true });
  };

  return { save, restore };
}
