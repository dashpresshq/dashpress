const { error } = console;
const { warn } = console;

console.warn = function (message) {
  // eslint-disable-next-line prefer-rest-params
  warn.apply(console, arguments); // keep default behaviour
  throw message;
};

console.error = function (message) {
  // eslint-disable-next-line prefer-rest-params
  error.apply(console, arguments);
  throw message;
};

export {};
