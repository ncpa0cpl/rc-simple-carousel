import { CalculateNextScrollByParams } from "../types";
import {
  getFirstInvisibleChildToLeft,
  getFirstInvisibleChildToRight,
} from "./get-first-invisible-child";

export const adjustToSnap = (
  scrollBy: number,
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

      if (hiddenWidth > ficFullWidth / 2) {
        const newScrollBy = scrollBy - (ficFullWidth - hiddenWidth);
        if (newScrollBy <= 5) {
          return scrollBy;
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

      if (hiddenWidth > ficFullWidth / 2) {
        const newScrollBy = scrollBy - (ficFullWidth - hiddenWidth);
        if (newScrollBy <= 5) {
          return scrollBy;
        }
        return newScrollBy;
      } else {
        return scrollBy + hiddenWidth;
      }
    }
  }
};
