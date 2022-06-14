import { AnimationDurationProp } from "../types";

export const resolveAnimationDuration = (
  duration: AnimationDurationProp | undefined,
  lastOffset: number,
  currentOffset: number
) => {
  if (!duration) return 500;

  if (typeof duration === "number") {
    return duration;
  }

  const nextScrollBy = Math.abs(lastOffset - currentOffset);

  return duration(nextScrollBy);
};
