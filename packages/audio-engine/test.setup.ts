import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

// Ensure HTMLMediaElement constants are available for tests
if (typeof HTMLMediaElement !== "undefined") {
  // Define constants that might not be available in happy-dom
  if (HTMLMediaElement.HAVE_NOTHING === undefined) {
    Object.defineProperty(HTMLMediaElement, "HAVE_NOTHING", {
      value: 0,
      writable: false,
      configurable: false,
    });
  }
  if (HTMLMediaElement.HAVE_METADATA === undefined) {
    Object.defineProperty(HTMLMediaElement, "HAVE_METADATA", {
      value: 1,
      writable: false,
      configurable: false,
    });
  }
  if (HTMLMediaElement.HAVE_CURRENT_DATA === undefined) {
    Object.defineProperty(HTMLMediaElement, "HAVE_CURRENT_DATA", {
      value: 2,
      writable: false,
      configurable: false,
    });
  }
  if (HTMLMediaElement.HAVE_FUTURE_DATA === undefined) {
    Object.defineProperty(HTMLMediaElement, "HAVE_FUTURE_DATA", {
      value: 3,
      writable: false,
      configurable: false,
    });
  }
  if (HTMLMediaElement.HAVE_ENOUGH_DATA === undefined) {
    Object.defineProperty(HTMLMediaElement, "HAVE_ENOUGH_DATA", {
      value: 4,
      writable: false,
      configurable: false,
    });
  }
}
