import React from "react";
import { animated, useSpring } from "react-spring";
import "./styles.scss";

type ScrollDirection = "left" | "right";

type ScrollByProp =
  | number
  | `${number}%`
  | ((
      currentOffset: number,
      containerWidth: number,
      childrenWidths: number[]
    ) => number);

type AnimationDurationProp = number | ((nextScrollAmount: number) => number);

export type CarouselProps = {
  /** Defines by how much scroll the carousel on arrow click. This property
   * can be a percentage, it then will scroll by a percentage of the wrapper
   * width, a number it will then scroll by the amount needed to show the
   * next number of slides specified or a function which should return the
   * exact amount of pixels by which to scroll.
   * */
  scrollBy?: ScrollByProp;
  animationDuration?: AnimationDurationProp;
  renderArrowButton?: (direction: "right" | "left") => JSX.Element;
};

const renderDefaultArrowButton = (direction: "right" | "left") => {
  return (
    <span className="simple-carousel-default-button">
      {direction === "right" ? ">" : "<"}
    </span>
  );
};

const getElementFullWidth = (element: Element) => {
  const computedStyle = getComputedStyle(element);

  const styleToNumber = (v: string) => Number(v.replace(/[^0-9.]/g, ""));

  return (
    element.clientWidth +
    styleToNumber(computedStyle.marginLeft) +
    styleToNumber(computedStyle.marginRight)
  );
};

const getFirstInvisibleChild = (
  wrapperWidth: number,
  currentOffset: number,
  childrenWidths: number[]
): [index: number, invisibleWidth: number] => {
  let currentIndex = 0;
  let widthSum = 0;

  const totalOffsetAndWrapperWidth = currentOffset + wrapperWidth;
  while (true) {
    if (!(currentIndex in childrenWidths)) return [-1, 0];

    const nextSum = widthSum + childrenWidths[currentIndex];
    if (nextSum > totalOffsetAndWrapperWidth) {
      return [currentIndex, nextSum - totalOffsetAndWrapperWidth];
    }

    widthSum = nextSum;
    currentIndex++;
  }
};

const calculateNextScrollBy = (
  currentOffset: number,
  scrollBy: ScrollByProp,
  wrapper: HTMLDivElement,
  childrenWidths: number[],
  direction: ScrollDirection
): number => {
  const totalChildrenWidth = childrenWidths.reduce(
    (sum, element) => sum + element,
    0
  );
  const wrapperWidth = wrapper.clientWidth;

  if (typeof scrollBy === "function")
    return scrollBy(currentOffset, wrapperWidth, childrenWidths);

  if (childrenWidths.length === 0 || totalChildrenWidth <= wrapperWidth)
    return 0;

  if (typeof scrollBy === "number") {
    switch (direction) {
      case "right":
        const [firstInvisibleChildIndex, firstInvisibleChildWidth] =
          getFirstInvisibleChild(wrapperWidth, currentOffset, childrenWidths);

        if (firstInvisibleChildIndex === -1) return 0;

        let scrollByTotal = firstInvisibleChildWidth;

        if (scrollByTotal >= wrapperWidth) return wrapperWidth;

        for (let i = 1; i < scrollBy; i++) {
          const nextChildIndex = firstInvisibleChildIndex + i;
          if (!(nextChildIndex in childrenWidths)) break;

          const nextScrollByTotal =
            scrollByTotal + childrenWidths[nextChildIndex];

          if (nextScrollByTotal >= wrapperWidth) return wrapperWidth;

          scrollByTotal = nextScrollByTotal;
        }

        return scrollByTotal;
      case "left":
        // TODO: inverse the above logic and put it here
        return 0;
    }
  }

  const scrollByPercent = Number(scrollBy.replace("%", "")) / 100;
  const scrollByTotal = scrollByPercent * wrapperWidth;
  return scrollByTotal;
};

const resolveAnimationDuration = (
  duration: AnimationDurationProp | undefined,
  lastOffset: number,
  currentOffset: number
) => {
  if (!duration) return 500;

  if (typeof duration === "number") {
    return duration;
  }

  const nextScrollBy = Math.abs(lastOffset - currentOffset);

  duration(nextScrollBy);
};

export const Carousel: React.FC<React.PropsWithChildren<CarouselProps>> = (
  props
) => {
  const { scrollBy = 1 } = props;
  const renderArrowButton = props.renderArrowButton ?? renderDefaultArrowButton;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const previousOffset = React.useRef(0);
  const [offset, setOffset] = React.useState(0);
  const animatedValue = useSpring({
    left: offset,
    config: {
      duration: resolveAnimationDuration(
        props.animationDuration,
        offset,
        previousOffset.current
      ),
    },
  });

  const onClick = (direction: ScrollDirection) => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (container && wrapper) {
      const childrenWidths = [...container.children].map((child) =>
        getElementFullWidth(child)
      );
      const contentTotalWidth = childrenWidths.reduce(
        (sum, element) => sum + element,
        0
      );

      const divWidth = wrapper.clientWidth;
      const scrollByAmount = calculateNextScrollBy(
        -1 * offset,
        scrollBy,
        wrapper,
        childrenWidths,
        direction
      );

      switch (direction) {
        case "right": {
          const maxOffset = -Math.max(0, contentTotalWidth - divWidth);

          setOffset((currentOffset) => {
            if (currentOffset <= maxOffset) {
              return 0;
            }
            const newOffset = Math.max(
              maxOffset,
              currentOffset - scrollByAmount
            );
            return newOffset;
          });
          break;
        }
        case "left": {
          setOffset((currentOffset) => {
            const newOffset = Math.min(0, currentOffset + scrollByAmount);
            return newOffset;
          });
          break;
        }
      }
    }
  };

  if (offset !== previousOffset.current) {
    previousOffset.current = offset;
  }

  return (
    <div className="simple-carousel">
      <div
        onClick={() => onClick("left")}
        className="simple-carousel-button-wrapper"
      >
        {renderArrowButton("left")}
      </div>
      <div ref={wrapperRef} className="simple-carousel-content-wrapper">
        <animated.div
          ref={containerRef}
          style={animatedValue}
          className="simple-carousel-container"
        >
          {props.children}
        </animated.div>
      </div>
      <div
        onClick={() => onClick("right")}
        className="simple-carousel-button-wrapper"
      >
        {renderArrowButton("right")}
      </div>
    </div>
  );
};
