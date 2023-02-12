export const createLogger = () => ({
  error: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
});

export const format = {
  printf: jest.fn(),
  splat: jest.fn(),
  combine: jest.fn(),
  colorize: jest.fn(),
};

export const transports = { Console: jest.fn() };
