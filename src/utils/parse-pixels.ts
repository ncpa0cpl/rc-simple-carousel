import type { Pixels } from "../types";

export const parsePixels = (pixels: Pixels) => {
  return Number(pixels.replace("px", ""));
};
