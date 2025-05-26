import {
    $getSelection
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import {
    $createQuoteNode
} from '@lexical/rich-text';

export const formatQuote = (editor, blockType) => {
    if (blockType !== 'quote') {
        editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createQuoteNode());
        });
    }
};