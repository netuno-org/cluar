import React from "react";
import Default from "./Default";
import Secondary from "./Secondary";
import DefaultSubBanner from "./DefaultSubBanner";

const Banner = (props) => {
    let layout = null;

    if (props.type === 'Default') {
        layout = (
            <Default
                {...props}
            />
        );
    } else if (props.type === 'Secondary') {
        layout = (
            <Secondary
                {...props}
            />
        );
    } else if (props.type === 'DefaultSubBanner') {
        layout = (
            <DefaultSubBanner
                {...props}
            />
        );
    } else {
        layout = (
            <Default
                {...props}
            />
        );
    }

    return <section className="banner">{layout}</section>
}

export default Banner;