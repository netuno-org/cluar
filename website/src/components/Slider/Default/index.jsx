import React from "react";

import Item from "./Item";
import { useKeenSlider } from "keen-slider/react";

import "./index.less";

function Default({
  section,
  type,
  image,
  image_title,
  image_alt,
  title,
  content,
  items,
  uid,
}) {
  const [sliderRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        let timeout = null;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const children = [];

  for (const item of items) {
    children.push(<Item {...{ type, ...item }} />);
  }

  return (
    <div
      key={`uid-${items?.length}`}
      ref={sliderRef}
      className={`slider__${type} keen-slider`}
    >
      {children}
    </div>
  );
}

export default Default;
