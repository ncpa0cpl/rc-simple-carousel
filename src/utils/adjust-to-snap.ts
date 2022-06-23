import { CalculateNextScrollByParams } from "../types";
import {
  getFirstInvisibleChildToLeft,
  getFirstInvisibleChildToRight,
} from "./get-first-invisible-child";

export const adjustToSnap = (
  scrollBy: number,
  directionThreshold: number,
  params: CalculateNextScrollByParams
): number => {
  switch (params.direction) {
    case "right": {
      const [firstInvisibleChildIndex, hiddenWidth] =
        getFirstInvisibleChildToRight({
          ...params,
          currentOffset: params.currentOffset + scrollBy,
        });

      const ficFullWidth = params.childrenWidths[firstInvisibleChildIndex];

      if (hiddenWidth > ficFullWidth * directionThreshold) {
        const newScrollBy =
          ficFullWidth > hiddenWidth
            ? scrollBy - (ficFullWidth - hiddenWidth)
            : scrollBy + hiddenWidth;

        if (newScrollBy <= 0) {
          return scrollBy + hiddenWidth;
        }

        return newScrollBy;
      } else {
        return scrollBy + hiddenWidth;
      }
    }
    case "left": {
      const [firstInvisibleChildIndex, hiddenWidth] =
        getFirstInvisibleChildToLeft({
          ...params,
          currentOffset: params.currentOffset - scrollBy,
        });

      const ficFullWidth = params.childrenWidths[firstInvisibleChildIndex];

      if (hiddenWidth > ficFullWidth * directionThreshold) {
        const newScrollBy =
          ficFullWidth > hiddenWidth
            ? scrollBy - (ficFullWidth - hiddenWidth)
            : scrollBy + hiddenWidth;

        if (newScrollBy <= 0) {
          return scrollBy + hiddenWidth;
        }

        return newScrollBy;
      } else {
        return scrollBy + hiddenWidth;
      }
    }
  }
};
