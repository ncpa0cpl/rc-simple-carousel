/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  root: "./src",
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
    "@snowpack/plugin-sass",
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    external: ["react", "react-dom", "react-spring"],
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    out: "./dist",
  },
};
