import React from "react";
import ReactDOM from "react-dom";
import { Carousel } from "./Carousel";
import "./styles.scss";

const App = () => {
  return (
    <div style={{ width: "100%" }}>
      <Carousel scrollBy={1} animationDuration={(scrollBy) => scrollBy * 2.5}>
        <div className="movie-tag-card">
          <h2>Action</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Crime</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Thriller</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Biography</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Comedy</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Music</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Adventure</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Fantasy</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Mystery</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Sci-Fi</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Western</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Romance</h2>
        </div>
        <div className="movie-tag-card">
          <h2>History</h2>
        </div>
        <div className="movie-tag-card">
          <h2>MCU</h2>
        </div>
        <div className="movie-tag-card">
          <h2>War</h2>
        </div>
        <div className="movie-tag-card">
          <h2>Drama</h2>
        </div>
      </Carousel>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
