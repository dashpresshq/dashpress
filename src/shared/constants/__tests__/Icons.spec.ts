import { systemIconToSVG } from "../Icons";

describe("systemIconToSVG", () => {
  it("should return the SVG for the given system icon with just path", () => {
    expect(systemIconToSVG("Activity")).toBe(`<svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>`);
  });

  it("should return the SVG for the given system icon with path and circle", () => {
    expect(systemIconToSVG("User", 4)).toBe(`<svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" cx="12" cy="7" r="4" />
              </svg>`);
  });

  it("should return the SVG for the given system icon with polygon", () => {
    expect(systemIconToSVG("Zap", 4)).toBe(`<svg
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <polygon fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>`);
  });

  it("should return the SVG invalid icons", () => {
    expect(systemIconToSVG("invalid icon", 4)).toBe("invalid icon");
  });
});
