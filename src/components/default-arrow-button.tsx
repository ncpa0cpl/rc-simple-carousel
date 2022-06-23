import React from "react";
import type { ScrollDirection } from "../types";
import "./styles.scss";

export const DefaultArrowButton = (props: { direction: ScrollDirection }) => {
  const { direction } = props;

  return (
    <span className="simple-carousel-default-button">
      {direction === "right" ? ">" : "<"}
    </span>
  );
};
