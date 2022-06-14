import React from "react";
import { animated, useSpring } from "react-spring";
import { DefaultArrowButton } from "./components/default-arrow-button";
import "./styles.scss";
import {
  CarouselProps,
  ScrollByProp,
  ScrollDirection,
  ScrollFn,
} from "./types";
import { calculateNextScrollBy } from "./utils/calculate-next-scroll-by";
import { getEasing } from "./utils/easings";
import { getElementFullWidth } from "./utils/get-element-full-width";
import { resolveAnimationDuration } from "./utils/resolve-animation-duration";

const renderDefaultArrowButton = (direction: "right" | "left") => (
  <DefaultArrowButton direction={direction} />
);

export const Carousel: React.FC<React.PropsWithChildren<CarouselProps>> = (
  props
) => {
  const {
    easing = "easeInOutQuad",
    forceSnap = false,
    loop = false,
    scrollBy = 1,
    visibilityThreshold = 20,
    showArrowButtons = true,
    animationDuration,
    bindController,
  } = props;

  const renderArrowButton = props.renderArrowButton ?? renderDefaultArrowButton;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const previousOffset = React.useRef(0);
  const [offset, setOffset] = React.useState(0);
  const animatedValue = useSpring({
    left: offset,
    config: {
      duration: resolveAnimationDuration(
        animationDuration,
        offset,
        previousOffset.current
      ),
      easing: getEasing(easing),
    },
  });

  const scroll: ScrollFn = React.useCallback(
    (direction: ScrollDirection, fnScrollBy: ScrollByProp = scrollBy) => {
      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      if (container && wrapper) {
        setOffset((offset) => {
          const childrenWidths = [...container.children].map((child) =>
            getElementFullWidth(child)
          );
          const contentTotalWidth = childrenWidths.reduce(
            (sum, element) => sum + element,
            0
          );

          const divWidth = wrapper.clientWidth;
          const scrollByAmount = calculateNextScrollBy({
            childrenWidths,
            currentOffset: -1 * offset,
            direction,
            forceSnap,
            scrollBy: fnScrollBy,
            visibilityThreshold,
            wrapper,
            totalChildrenWidth: contentTotalWidth,
          });

          const maxOffset = -Math.max(0, contentTotalWidth - divWidth);
          switch (direction) {
            case "right": {
              if (offset <= maxOffset && loop) {
                return 0;
              }
              const newOffset = Math.max(maxOffset, offset - scrollByAmount);
              return newOffset;
            }
            case "left": {
              if (offset >= 0 && loop) {
                return maxOffset;
              }
              const newOffset = Math.min(0, offset + scrollByAmount);
              return newOffset;
            }
          }
        });
      }
    },
    [visibilityThreshold, loop, forceSnap, easing, scrollBy]
  );

  if (offset !== previousOffset.current) {
    previousOffset.current = offset;
  }

  if (bindController) {
    bindController._setScrollFn(scroll);
  }

  return (
    <div className="simple-carousel">
      {showArrowButtons ? (
        <div
          onClick={() => scroll("left")}
          className="simple-carousel-button-wrapper"
        >
          {renderArrowButton("left")}
        </div>
      ) : (
        <></>
      )}
      <div ref={wrapperRef} className="simple-carousel-content-wrapper">
        <animated.div
          ref={containerRef}
          style={animatedValue}
          className="simple-carousel-container"
        >
          {props.children}
        </animated.div>
      </div>
      {showArrowButtons ? (
        <div
          onClick={() => scroll("right")}
          className="simple-carousel-button-wrapper"
        >
          {renderArrowButton("right")}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
