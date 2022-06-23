import { isTouchEvent } from "./is-touch-event";

export const getCords = (e: React.TouchEvent | React.MouseEvent) => {
  if (isTouchEvent(e)) {
    return {
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY,
    };
  } else {
    return {
      clientX: e.clientX,
      clientY: e.clientY,
    };
  }
};
