import React from 'react';
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
    let layout = null;
    const actionsData = Cluar.actions() || [];
    const actions = (props.action_uids || []).map(uid =>
        actionsData.find(item => item.uid === uid)
    ).filter(Boolean);

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
                actions={actions.length > 0 ? actions : props.actions}
            />
        );
    } else if (props.type === 'ImageLeft') {
        layout = (
            <ImageLeft
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageRight') {
        layout = (
            <ImageRight
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageTop') {
        layout = (
            <ImageTop
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageBottom') {
        layout = (
            <ImageBottom
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (props.type === 'ImageContent') {
        layout = (
            <ImageContent
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else {
        layout = (
            <Default
                {...props}
                actions={actions.length > 0 ? actions : props.actions}
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