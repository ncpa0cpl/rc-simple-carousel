export const isTouchEvent = (
  event: React.TouchEvent | React.MouseEvent
): event is React.TouchEvent => !!(event as React.TouchEvent).touches;
