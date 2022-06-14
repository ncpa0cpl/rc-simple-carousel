import { Easings } from "./utils/easings";

export type ScrollDirection = "left" | "right";

export type Percentage = `${number}%`;

export type ScrollByProp =
  | number
  | Percentage
  | ((
      currentOffset: number,
      containerWidth: number,
      childrenWidths: number[]
    ) => number);

export type AnimationDurationProp =
  | number
  | ((nextScrollAmount: number) => number);

export type CarouselProps = {
  /**
   * Defines by how much scroll the carousel on arrow click. This property
   * can be a percentage, it then will scroll by a percentage of the wrapper
   * width, a number it will then scroll by the amount needed to show the
   * next number of slides specified or a function which should return the
   * exact amount of pixels by which to scroll.
   */
  scrollBy?: ScrollByProp;
  /**
   * Scroll animation duration (ms), can be a static numeric value or a function that
   * takes as it's argument the amount of pixels that the Carousel is going
   * to scroll by, and returns the duration for that specific animation. This
   * can be used to make the animation always run at the same speed.
   *
   * @example
   * // To get an animation with speed of 1000px/second:
   * <Carousel
   *    animationDuration={px => px}
   * />
   * // To get an animation with speed of 500px/second:
   * <Carousel
   *    animationDuration={px => 2 * px}
   * />
   */
  animationDuration?: AnimationDurationProp;
  /**
   * The minimum amount of a slide in view to be considered visible. Can be
   * a numeric value to represent pixels, or a string that represents
   * percentage of the total slide width.
   *
   * For example:
   *
   * When set to 50%, at least 50% of any given slide must be in view for it
   * to be considered visible, if a slide is considered visible, on the next
   * scroll event, the Carousel will try to scroll to the next slide that comes
   * after the one that's at least 50% in view. And vice versa if a Slide is not
   * considered visible, then on the next scroll event, it will attempt to only
   * scroll to that Slide.
   */
  visibilityThreshold?: Percentage | number;
  /**
   * Easing function to use when animating the Carousel scroll.
   */
  easing?: Easings;
  /**
   * Only used when scroll by is a percentage value or a function or when
   * scrolling via touch swipe gesture. Enabling this option will force Carousel
   * to snap to slides when scrolling.
   */
  forceSnap?: boolean;
  /**
   * When the last slide of the Carousel is reached, jump to the other end
   * if this option is enabled.
   */
  loop?: boolean;
  /**
   * Set to false to not show the left and right arrow buttons.
   */
  showArrowButtons?: boolean;
  /**
   * Bind this Carousel to the specified Controller, a controller can be acquired
   * from the `useCarousel` hook.
   */
  bindController?: {
    _setScrollFn(fn: ScrollFn): void;
  };
  /**
   * A function rendering the left and right arrow buttons. If not specified
   * a default button will be rendered.
   */
  renderArrowButton?: (direction: "right" | "left") => JSX.Element;
};

export type CalculateNextScrollByParams = {
  childrenWidths: number[];
  currentOffset: number;
  direction: ScrollDirection;
  forceSnap: boolean;
  scrollBy: ScrollByProp;
  visibilityThreshold: number | Percentage;
  wrapper: HTMLDivElement;
  totalChildrenWidth: number;
};

export type ScrollFn = (
  direction: ScrollDirection,
  fnScrollBy?: ScrollByProp
) => void;
