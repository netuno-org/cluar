import React, { useState, useEffect } from 'react';
import Cluar from '../../common/Cluar';

import './index.less';

import TextContent from './TextContent';
import ImageLeft from './ImageLeft';
import ImageRight from './ImageRight';
import ImageTop from './ImageTop';
import ImageBottom from './ImageBottom';
import ImageContent from './ImageContent';
import Default from './Default';

const Content = (props) => {
    const [renderedActions, setRenderedActions] = useState(props.actions);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const actionsData = Cluar.actions() || [];
    const actions = (props.action_uids || [])
        .map(uid => actionsData.find(item => item.uid === uid))
        .filter(Boolean);

    useEffect(() => {
        if (!isFirstRender) {
            setRenderedActions(actions);
        } else {
            setIsFirstRender(false);
        }
    }, [props.action_uids]);

    let layout = null;

    const imageStyle = {};

    const imageSrc =
        props.image?.indexOf("base64") === -1
            ? `/cluar/images/page_${props.section}/${props.image}`
            : props.image;

    if (props.image_max_width > 0) {
        imageStyle["maxWidth"] = `${props.image_max_width}px`;
    }

    if (props.type === 'TextContent') {
        layout = (
            <TextContent
                {...props}
                actions={renderedActions}
            />
        );
    } else if (props.type === 'ImageLeft') {
        layout = (
            <ImageLeft
                {...props}
                actions={renderedActions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageRight') {
        layout = (
            <ImageRight
                {...props}
                actions={renderedActions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageTop') {
        layout = (
            <ImageTop
                {...props}
                actions={renderedActions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageBottom') {
        layout = (
            <ImageBottom
                {...props}
                actions={renderedActions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageContent') {
        layout = (
            <ImageContent
                {...props}
                actions={renderedActions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else {
        layout = (
            <Default
                {...props}
                actions={renderedActions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    }

    return (
        <section className="content">
            {layout}
        </section>
    );
};

export default Content;