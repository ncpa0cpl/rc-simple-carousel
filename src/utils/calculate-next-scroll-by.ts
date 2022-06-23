import type { CalculateNextScrollByParams, Percentage, Pixels } from "../types";
import { adjustToSnap } from "./adjust-to-snap";
import {
  getFirstInvisibleChildToLeft,
  getFirstInvisibleChildToRight,
} from "./get-first-invisible-child";
import { parsePercentage } from "./parse-percentage";
import { parsePixels } from "./parse-pixels";

export const isPercentage = (value: string): value is Percentage => {
  return value.endsWith("%");
};

export const isPixel = (value: string): value is Pixels => {
  return value.endsWith("px");
};

export const calculateNextScrollBy = (
  params: CalculateNextScrollByParams
): number => {
  const {
    childrenWidths,
    currentOffset,
    direction,
    forceSnap,
    scrollBy,
    wrapper,
    totalChildrenWidth,
  } = params;

  const wrapperWidth = wrapper.clientWidth;

  if (typeof scrollBy === "function") {
    const scrollByTotal = scrollBy(currentOffset, wrapperWidth, childrenWidths);

    if (forceSnap) return adjustToSnap(scrollByTotal, 0.5, params);
    return scrollByTotal;
  }

  if (childrenWidths.length === 0 || totalChildrenWidth <= wrapperWidth)
    return 0;

  if (typeof scrollBy === "number") {
    switch (direction) {
      case "right": {
        const [firstInvisibleChildIndex, firstInvisibleChildWidth] =
          getFirstInvisibleChildToRight(params);

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
      }
      case "left": {
        const [firstInvisibleChildIndex, firstInvisibleChildWidth] =
          getFirstInvisibleChildToLeft(params);

        if (firstInvisibleChildIndex === -1) return 0;

        let scrollByTotal = firstInvisibleChildWidth;

        if (scrollByTotal >= wrapperWidth) return wrapperWidth;

        for (let i = 1; i < scrollBy; i++) {
          const nextChildIndex = firstInvisibleChildIndex - i;
          if (!(nextChildIndex in childrenWidths)) break;

          const nextScrollByTotal =
            scrollByTotal + childrenWidths[nextChildIndex];

          if (nextScrollByTotal >= wrapperWidth) return wrapperWidth;

          scrollByTotal = nextScrollByTotal;
        }

        return scrollByTotal;
      }
    }
  }

  if (isPercentage(scrollBy)) {
    const scrollByPercent = parsePercentage(scrollBy);
    const scrollByTotal = scrollByPercent * wrapperWidth;
    if (forceSnap) return adjustToSnap(scrollByTotal, 0.5, params);
    return scrollByTotal;
  }

  if (isPixel(scrollBy)) {
    const scrollByPixels = parsePixels(scrollBy);
    if (forceSnap) return adjustToSnap(scrollByPixels, 0.5, params);
    return scrollByPixels;
  }

  return 0;
};
