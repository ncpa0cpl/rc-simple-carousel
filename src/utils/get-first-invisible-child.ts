import type { CalculateNextScrollByParams } from "../types";
import { parsePercentage } from "./parse-percentage";

export const getFirstInvisibleChildToRight = (
  params: CalculateNextScrollByParams
): [index: number, invisibleWidth: number] => {
  const { childrenWidths, currentOffset, wrapper, visibilityThreshold } =
    params;

  const wrapperWidth = wrapper.clientWidth;
  let currentIndex = 0;
  let widthSum = 0;

  const totalOffsetAndWrapperWidth = currentOffset + wrapperWidth;
  while (true) {
    if (!(currentIndex in childrenWidths)) return [-1, 0];

    const childWidth = childrenWidths[currentIndex];
    const nextSum = widthSum + childWidth;

    const threshold =
      typeof visibilityThreshold === "number"
        ? visibilityThreshold
        : (1 - parsePercentage(visibilityThreshold)) * childWidth;

    if (nextSum > totalOffsetAndWrapperWidth) {
      if (nextSum - totalOffsetAndWrapperWidth > threshold)
        return [currentIndex, nextSum - totalOffsetAndWrapperWidth];
    }

    widthSum = nextSum;
    currentIndex++;
  }
};

export const getFirstInvisibleChildToLeft = (
  params: CalculateNextScrollByParams
): [index: number, invisibleWidth: number] => {
  const { childrenWidths, currentOffset, visibilityThreshold } = params;

  let currentIndex = 0;
  let widthSum = 0;

  while (true) {
    if (!(currentIndex in childrenWidths)) return [-1, 0];

    const childWidth = childrenWidths[currentIndex];
    const nextSum = widthSum + childWidth;

    const threshold =
      typeof visibilityThreshold === "number"
        ? visibilityThreshold
        : (1 - parsePercentage(visibilityThreshold)) * childWidth;

    if (nextSum >= currentOffset) {
      if (currentOffset - widthSum > threshold || currentIndex === 0)
        return [currentIndex, currentOffset - widthSum];
      else {
        const prevChildWidth = childrenWidths[currentIndex - 1];
        return [currentIndex - 1, currentOffset - widthSum + prevChildWidth];
      }
    }

    widthSum = nextSum;
    currentIndex++;
  }
};
