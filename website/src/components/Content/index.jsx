import React from 'react';
import Actions from '../Actions';

import './index.less';

import TextContent from './TextContent';
import ImageLeft from './ImageLeft';
import ImageRight from './ImageRight';
import ImageTop from './ImageTop';
import ImageBottom from './ImageBottom';
import ImageContent from './ImageContent';
import Default from './Default';

const Content = ({ section, type, title, content, image, image_title, image_alt, image_max_width, actions }) => {
    let layout = null;
    const imageStyle = {};

    const imageSrc =
        image?.indexOf("base64") === -1
            ? `/cluar/images/page_${section}/${image}`
            : image;

    if (image_max_width > 0) {
        imageStyle["maxWidth"] = `${image_max_width}px`;
    }

    if (type === 'text') {
        layout = (
            <TextContent
                title={title}
                content={content}
            />
        );
    } else if (type === 'image-left') {
        layout = (
            <ImageLeft
                title={title}
                content={content}
                image_title={image_title}
                image_alt={image_alt}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (type === 'image-right') {
        layout = (
            <ImageRight
                title={title}
                content={content}
                image_title={image_title}
                image_alt={image_alt}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (type === 'image-top') {
        layout = (
            <ImageTop
                title={title}
                content={content}
                image_title={image_title}
                image_alt={image_alt}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (type === 'image-bottom') {
        layout = (
            <ImageBottom
                title={title}
                content={content}
                image_title={image_title}
                image_alt={image_alt}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else if (type === 'image') {
        layout = (
            <ImageContent
                image_title={image_title}
                image_alt={image_alt}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    } else {
        layout = (
            <Default
                title={title}
                content={content}
                image_title={image_title}
                image_alt={image_alt}
                imageSrc={imageSrc}
                imageStyle={imageStyle}
            />
        );
    }

    return (
        <section className="content">
            {layout}
            <Actions {... { section, type, actions }} />
        </section>
    );
};

export default Content;