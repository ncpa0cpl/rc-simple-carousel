import React from "react";
import { ScrollFn } from "./types";

export type CarouselController = {
  scroll(...args: Parameters<ScrollFn>): void;
  _setScrollFn(fn: ScrollFn): void;
};

export const useCarousel = (): CarouselController => {
  const scroll = React.useRef<ScrollFn>(() => {});

  const _setScrollFn = React.useCallback((fn: ScrollFn) => {
    scroll.current = fn;
  }, []);

  return {
    get scroll() {
      return scroll.current;
    },
    _setScrollFn,
  };
};
