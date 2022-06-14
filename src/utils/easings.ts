import { EasingFunction, easings } from "react-spring";

export type Easings = keyof typeof easings;

export const getEasing = (name: Easings): EasingFunction => {
  return easings[name];
};
