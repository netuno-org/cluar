import { useEffect } from 'react';
import {
    $insertNodes,
    COMMAND_PRIORITY_EDITOR,
    COMMAND_PRIORITY_HIGH,
    COMMAND_PRIORITY_LOW,
    $createParagraphNode,
    $isRootOrShadowRoot,
    createCommand
} from 'lexical';
import {
    useLexicalComposerContext
} from '@lexical/react/LexicalComposerContext';
import {
    DRAGSTART_COMMAND,
    DRAGOVER_COMMAND,
    DROP_COMMAND,
} from 'lexical';
import {
    $createImageNode,
    ImageNode
} from '../nodes/ImageNode';
import { mergeRegister, $wrapNodeInElement } from '@lexical/utils';

import { INSERT_IMAGE_COMMAND } from '../utils/commands';

export default function ImagesPlugin({ captionsEnabled }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        } else {
            console.log("ImagesPlugin: ImageNode registered on editor");
        }

        return mergeRegister(
            editor.registerCommand(
                INSERT_IMAGE_COMMAND,
                (payload) => {
                    console.log("INSERT_IMAGE_COMMAND", "OLÁ");
                    const imageNode = $createImageNode(payload);
                    $insertNodes([imageNode]);

                    const parent = imageNode.getParentOrThrow();
                    if ($isRootOrShadowRoot(parent)) {
                        $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
                    }

                    return true;
                },
                COMMAND_PRIORITY_EDITOR,
            )
        );
    }, [editor, captionsEnabled]);

    return null;
}