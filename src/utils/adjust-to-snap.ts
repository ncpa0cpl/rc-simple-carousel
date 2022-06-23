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

      const firstInvisibleChildWidth =
        params.childrenWidths[firstInvisibleChildIndex];

      if (hiddenWidth > firstInvisibleChildWidth * directionThreshold) {
        const newScrollBy = scrollBy - (firstInvisibleChildWidth - hiddenWidth);

        if (
          scrollBy > firstInvisibleChildWidth ||
          hiddenWidth > firstInvisibleChildWidth
        ) {
          return newScrollBy;
        }

        if (newScrollBy <= 0) {
          return scrollBy + hiddenWidth;
        }
      }
      return scrollBy + hiddenWidth;
    }
    case "left": {
      const [firstInvisibleChildIndex, hiddenWidth] =
        getFirstInvisibleChildToLeft({
          ...params,
          currentOffset: params.currentOffset - scrollBy,
        });

      const firstInvisibleChildWidth =
        params.childrenWidths[firstInvisibleChildIndex];

      if (hiddenWidth > firstInvisibleChildWidth * directionThreshold) {
        const newScrollBy = scrollBy - (firstInvisibleChildWidth - hiddenWidth);

        if (
          scrollBy > firstInvisibleChildWidth ||
          hiddenWidth > firstInvisibleChildWidth
        ) {
          return newScrollBy;
        }

        if (newScrollBy <= 0) {
          return scrollBy + hiddenWidth;
        }
      }
      return scrollBy + hiddenWidth;
    }
  }
};
