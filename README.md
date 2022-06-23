# rc-simple-carousel

Simple React Carousel built on top of React Spring animation library.

![Demo](/demo/carousel-demo.gif)

## But why?

There is already many Carousel components out there, so why bother with making a new one?

The answer is simple, I needed to quickly add a Carousel to a website I was working on, and out of a few libraries I tried none was working out of the box. (I couldn't be bothered to troubleshoot them and find out why all slides of the carousel I was trying to make are rendered vertically when I specified in the props that I want it horizontal or why is the layout of it all over the place even though I imported all the css files, etc.) Out of frustration I made this component here. End of story.

## Installation

> npm i rc-simple-carousel react-spring

OR

> yarn add rc-simple-carousel react-spring

## Usage

```tsx
import { Carousel } from "rc-simple-carousel";

const Component = () => {
  return (
    <Carousel>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
  );
};
```

## Props

1. [animationDuration](#animationduration)
2. [arrowButtonWrapperClassName](#arrowbuttonwrapperclassname)
3. [bindController](#bindcontroller)
4. [className](#classname)
5. [contentClassName](#contentclassname)
6. [contentWrapperClassName](#contentwrapperclassname)
7. [easing](#easing)
8. [forceSnap](#forcesnap)
9. [loop](#loop)
10. [renderArrowButton](#renderarrowbutton)
11. [scrollBy](#scrollby)
12. [showArrowButtons](#showarrowbuttons)
13. [touchControls](#touchcontrols)
14. [trackMouse](#trackmouse)
15. [visibilityThreshold](#visibilitythreshold)

### **animationDuration**

Scroll animation duration (ms), can be a static numeric value or a function that takes as it's argument the amount of pixels that the Carousel is going to scroll by, and returns the duration for that specific animation. This can be used to make the animation always run at the same speed.

```ts
animationDuration={500} // animation will always take 500 ms
```

or

```ts
animationDuration={px => px} // animation will take as many milliseconds as pixels by which it moves
```

### **arrowButtonWrapperClassName**

Class name for the arrow button wrappers.

### **bindController**

Bind this Carousel to the specified Controller, a controller can be acquired from the `useCarousel` hook. A Controller can be used to manipulate the Carousel from the outside.

```tsx
import { Carousel, useCarousel } from "rc-simple-carousel";

const Component = () => {
  const carousel = useCarousel();

  const moveTheCarouselByOneSlideToRight = () => {
    carousel.scroll("right", 1);
  };

  const moveTheCarouselBy100pxToLeft = () => {
    carousel.scroll("left", "100px");
  };

  return (
    <Carousel bindController={carousel}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
  );
};
```

### **className**

Class names for the most-outer div of the carousel.

### **contentClassName**

Class name of the carousel content div (the direct parent of the carousel slides).

### **contentWrapperClassName**

Class name of the div wrapping around the carousel content div.

### **easing**

Easing function to use when animating the Carousel scroll. See the available easing's [here](#available-easings).

### **forceSnap**

Only used when scroll by is a percentage value, a function or when scrolling via touch swipe gesture. Enabling this option will force Carousel to snap to slides when scrolling.

### **loop**

When the last slide of the Carousel is reached, jump to the other end if this option is enabled.

> Note: looping does not work with swipe gestures

### **renderArrowButton**

A function rendering the left and right arrow buttons. If not specified a default button will be rendered.

### **scrollBy**

Defines by how much scroll the carousel on arrow button click. This property can be a:

- percentage, it then will scroll by a percentage of the carousel wrapper width (ex. `scrollBy={"50%"}`)
- pixels count, it will then always scroll by the exact same distance (ex. `scrollBy={"100px"}`)
- number, it will then scroll by the amount needed to show the next number of slides, so if the value is one, it will scroll by just enough to show the next slide that is not in view (ex. `scrollBy={1}`)
- function, which should return the exact amount of pixels by which to scroll, that function is provided with the `currentOffset`, `containerWidth` and `childrenWidths`arguments:

```ts
function scrollBy(
  currentOffset: number,
  containerWidth: number,
  childrenWidths: number[]
): number;
```

### **showArrowButtons**

Set to false to not render the left and right arrow buttons.

### **touchControls**

Enables touch control over the carousel (ability to scroll the carousel by swiping on it).

### **trackMouse**

When enabled, touch controls can also be used via mouse, by dragging on the carousel.

### **visibilityThreshold**

The minimum amount of a slide to be in view to be considered visible. Can be a numeric value (pixels), or a string that represents percentage of the total slide width.

```tsx
visibilityThreshold={"70%"} // at least 70% of a slide must be in view to be considered "visible"
```

```tsx
visibilityThreshold={100} // at least 100 pixels of a slide must be in view to be considered "visible"
```

## Available easing's

All the easing provided by the React Spring library can be used. Here's the list of all of them:

- `linear`
- `easeInQuad`
- `easeOutQuad`
- `easeInOutQuad`
- `easeInCubic`
- `easeOutCubic`
- `easeInOutCubic`
- `easeInQuart`
- `easeOutQuart`
- `easeInOutQuart`
- `easeInQuint`
- `easeOutQuint`
- `easeInOutQuint`
- `easeInSine`
- `easeOutSine`
- `easeInOutSine`
- `easeInExpo`
- `easeOutExpo`
- `easeInOutExpo`
- `easeInCirc`
- `easeOutCirc`
- `easeInOutCirc`
- `easeInBack`
- `easeOutBack`
- `easeInOutBack`
- `easeInElastic`
- `easeOutElastic`
- `easeInOutElastic`
- `easeInBounce`
- `easeOutBounce`
- `easeInOutBounce`
