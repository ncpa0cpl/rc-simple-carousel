import React from "react";
import { getCords } from "./get-cords";

export type BaseSwipeCords = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

export type SwipeCords = BaseSwipeCords & {
  deltaX: number;
  deltaY: number;
};

export type SwipeEndCords = BaseSwipeCords & {
  totalDeltaX: number;
  totalDeltaY: number;
};

export type UseSwipeOptions = {
  trackMouse?: boolean;
  onSwipe: (swipe: SwipeCords) => void;
  onSwipeEnd?: (swipe: SwipeEndCords) => void;
};

export const useSwipe = (options: UseSwipeOptions) => {
  const swipeState = React.useRef({
    isSwiping: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  });

  const onTouchStart = React.useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const { clientX, clientY } = getCords(e);
      swipeState.current.startX = clientX;
      swipeState.current.startY = clientY;
      swipeState.current.currentX = clientX;
      swipeState.current.currentY = clientY;
      swipeState.current.isSwiping = true;
    },
    []
  );

  const onTouchMove = React.useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!swipeState.current.isSwiping) return;

      const { clientX, clientY } = getCords(e);

      const deltaX = swipeState.current.currentX - clientX;
      const deltaY = swipeState.current.currentY - clientY;
      swipeState.current.currentX = clientX;
      swipeState.current.currentY = clientY;

      options.onSwipe({
        ...swipeState.current,
        deltaX,
        deltaY,
      });
    },
    [options.onSwipe]
  );

  const onTouchEnd = React.useCallback(() => {
    if (!swipeState.current.isSwiping) return;

    const totalDeltaX = swipeState.current.startX - swipeState.current.currentX;
    const totalDeltaY = swipeState.current.startY - swipeState.current.currentY;

    options.onSwipeEnd &&
      options.onSwipeEnd({ ...swipeState.current, totalDeltaX, totalDeltaY });

    swipeState.current.startX = 0;
    swipeState.current.startY = 0;
    swipeState.current.currentX = 0;
    swipeState.current.currentY = 0;
    swipeState.current.isSwiping = false;
  }, [options.onSwipeEnd]);

  if (!options.trackMouse) {
    return {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  }

  const isMouseSwipe = React.useRef(false);

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    isMouseSwipe.current = true;
    onTouchStart(e);
  }, []);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isMouseSwipe.current) return;
      onTouchMove(e);
    },
    [onTouchMove]
  );

  const onMouseUp = React.useCallback(() => {
    if (!isMouseSwipe.current) return;
    isMouseSwipe.current = false;
    onTouchEnd();
  }, [onTouchEnd]);

  React.useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
  };
};
