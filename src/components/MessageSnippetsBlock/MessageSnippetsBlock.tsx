'use strict';

import * as React from 'react';

import MessageTemplateEditor from "../MessageTemplateEditor/MessageTemplateEditor";

import IfThenElse from "../IfThenElse/IfThenElse";
import {
    IMessageTemplate,
    MESSAGE_TEMPLATE_BLOCK_TYPE,
} from "../../utils/MessageTemplate/types/MessageTemplate";

import "./MessageSnippetsBlock.scss";
import useBaseStore from "../../store/store";
import {shallow} from "zustand/shallow";

interface MessageSnippetsBlockProps {
    /** Количество вложенности (это технический параметр - страхуемся от зацикливания) {@link MAX_RECURSION_OF_NESTED_BLOCKS} */
    countNested: number,
    /** Путь к родительскому ifThenElse блоку */
    path?: IMessageTemplate.PathToBlock | void,
    /** Тип блока */
    blockType?: MESSAGE_TEMPLATE_BLOCK_TYPE | void,
}

const MessageSnippetsBlock: React.FC<MessageSnippetsBlockProps> = (props) => {
    const {
        path,
        blockType,
        countNested,
    } = props;
    const [ messageTemplate ] = useBaseStore(
        (stateManager) => [
            stateManager.state.messageTemplate,
            stateManager.state.messageTemplate.countIfThenElseBlocks,
        ],
        shallow,
    );
    const blockInformation = messageTemplate.getBlockInformationForce(
        path,
        blockType,
    );
    const {
        path: pathToCurrentBlock,
        field,
        fieldAdditional,
    } = blockInformation;
    const {
        fieldType: field_fieldType,
        isCanSplit: field_isCanSplit,
        positionInResultMessage: field_positionInResultMessage,
    } = field;
    const {
        fieldType: fieldAdditional_fieldType,
        isCanSplit: fieldAdditional_isCanSplit,
        positionInResultMessage: fieldAdditional_positionInResultMessage,
    } = fieldAdditional || {};

    return <div>
        <MessageTemplateEditor
            isCanSplit={field_isCanSplit}
            path={path}
            blockType={blockType}
            fieldType={field_fieldType}
        />
        {
            // если поле нельзя разбить, то оно уже разбито, тогда отрисуем дополнительные элементы (IF_THEN_ELSE и второй осколок разбитого поля)
            !field_isCanSplit
                ? <>
                    <IfThenElse
                        countNested={countNested}
                        path={pathToCurrentBlock}
                    />
                    <MessageTemplateEditor
                        isCanSplit={fieldAdditional_isCanSplit}
                        path={path}
                        blockType={blockType}
                        fieldType={fieldAdditional_fieldType}
                    />
                </>
                : null
        }
    </div>;
}

export default MessageSnippetsBlock;