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
import { SwipeEndCords, useSwipe } from "./use-swipe/use-swipe";
import { adjustToSnap } from "./utils/adjust-to-snap";
import { calculateNextScrollBy } from "./utils/calculate-next-scroll-by";
import { clsn } from "./utils/clsn";
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
    arrowButtonWrapperClassName,
    className,
    contentClassName,
    contentWrapperClassName,
    trackMouse = false,
    touchControls = false,
  } = props;

  const renderArrowButton = props.renderArrowButton ?? renderDefaultArrowButton;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const previousOffset = React.useRef(0);

  const [offsetAnimation, setOffsetAnimation] = React.useState({
    offset: 0,
    skipAnimation: false,
  });

  const animatedValue = useSpring({
    left: offsetAnimation.offset,
    config: offsetAnimation.skipAnimation
      ? { duration: 1 }
      : {
          duration: resolveAnimationDuration(
            animationDuration,
            offsetAnimation.offset,
            previousOffset.current
          ),
          easing: getEasing(easing),
        },
  });

  const swipeProps = useSwipe({
    trackMouse,
    onSwipe: React.useCallback(
      ({ deltaX }) => {
        if (!touchControls) return;

        const wrapper = wrapperRef.current;
        const container = containerRef.current;
        if (!wrapper || !container) return;

        const childrenWidths = [...container.children].map((child) =>
          getElementFullWidth(child)
        );
        const totalChildrenWidth = childrenWidths.reduce(
          (sum, element) => sum + element,
          0
        );

        const divWidth = wrapper.clientWidth;
        const maxOffset = -Math.max(0, totalChildrenWidth - divWidth) - 100;

        setOffsetAnimation((current) => ({
          offset: Math.min(100, Math.max(maxOffset, current.offset - deltaX)),
          skipAnimation: true,
        }));
      },
      [touchControls]
    ),
    onSwipeEnd: React.useCallback(
      ({ startX, currentX, totalDeltaX }: SwipeEndCords) => {
        if (!touchControls) return;

        const container = containerRef.current;
        const wrapper = wrapperRef.current;
        if (forceSnap && container && wrapper)
          setOffsetAnimation(({ offset }) => {
            const initialAnimationOffset = offset + totalDeltaX;

            const childrenWidths = [...container.children].map((child) =>
              getElementFullWidth(child)
            );
            const totalChildrenWidth = childrenWidths.reduce(
              (sum, element) => sum + element,
              0
            );

            const direction = currentX < startX ? "right" : "left";

            const scrollBy = adjustToSnap(Math.abs(totalDeltaX), 0.5, {
              currentOffset: -1 * initialAnimationOffset,
              scrollBy: Math.abs(totalDeltaX),
              childrenWidths,
              direction,
              forceSnap,
              totalChildrenWidth,
              visibilityThreshold,
              wrapper,
            });

            const maxOffset = -Math.max(
              0,
              totalChildrenWidth - wrapper.clientWidth
            );

            return {
              offset: Math.min(
                0,
                Math.max(
                  maxOffset,
                  direction === "right"
                    ? initialAnimationOffset - scrollBy
                    : initialAnimationOffset + scrollBy
                )
              ),
              skipAnimation: false,
            };
          });
      },
      [forceSnap, visibilityThreshold, touchControls]
    ),
  });

  const scroll: ScrollFn = React.useCallback(
    (direction: ScrollDirection, fnScrollBy: ScrollByProp = scrollBy) => {
      const container = containerRef.current;
      const wrapper = wrapperRef.current;
      if (container && wrapper) {
        setOffsetAnimation(({ offset }) => {
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
                return {
                  offset: 0,
                  skipAnimation: false,
                };
              }
              const newOffset = Math.max(maxOffset, offset - scrollByAmount);
              return { offset: newOffset, skipAnimation: false };
            }
            case "left": {
              if (offset >= 0 && loop) {
                return {
                  offset: maxOffset,
                  skipAnimation: false,
                };
              }
              const newOffset = Math.min(0, offset + scrollByAmount);
              return {
                offset: newOffset,
                skipAnimation: false,
              };
            }
          }
        });
      }
    },
    [visibilityThreshold, loop, forceSnap, easing, scrollBy]
  );

  if (offsetAnimation.offset !== previousOffset.current) {
    previousOffset.current = offsetAnimation.offset;
  }

  if (bindController) {
    bindController._setScrollFn(scroll);
  }

  return (
    <div className={clsn("simple-carousel", className)}>
      {showArrowButtons ? (
        <div
          onClick={() => scroll("left")}
          className={clsn(
            "simple-carousel-button-wrapper",
            arrowButtonWrapperClassName
          )}
        >
          {renderArrowButton("left")}
        </div>
      ) : (
        <></>
      )}
      <div
        {...(touchControls ? swipeProps : {})}
        ref={wrapperRef}
        className={clsn(
          "simple-carousel-content-wrapper",
          contentWrapperClassName
        )}
      >
        <animated.div
          ref={containerRef}
          style={animatedValue}
          className={clsn("simple-carousel-container", contentClassName)}
        >
          {props.children}
        </animated.div>
      </div>
      {showArrowButtons ? (
        <div
          onClick={() => scroll("right")}
          className={clsn(
            "simple-carousel-button-wrapper",
            arrowButtonWrapperClassName
          )}
        >
          {renderArrowButton("right")}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
