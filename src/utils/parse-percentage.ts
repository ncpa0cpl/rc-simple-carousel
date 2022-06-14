import { Percentage } from "../types";

export const parsePercentage = (percentage: Percentage) => {
  return Math.max(
    0.01,
    Math.min(0.99, Number(percentage.replace("%", "")) / 100)
  );
};
