import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock window.confirm
Object.defineProperty(window, "confirm", {
  writable: true,
  value: () => true,
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollIntoView
Element.prototype.scrollIntoView = () => {};

// Mock PointerEvent
global.PointerEvent = class PointerEvent extends Event {
  button: number;
  ctrlKey: boolean;
  pointerId: number;
  width: number;
  height: number;
  tiltX: number;
  tiltY: number;
  pointerType: string;
  isPrimary: boolean;

  constructor(type: string, props: PointerEventInit = {}) {
    super(type, props);
    this.button = props.button || 0;
    this.ctrlKey = props.ctrlKey || false;
    this.pointerId = props.pointerId || 1;
    this.width = props.width || 1;
    this.height = props.height || 1;
    this.tiltX = props.tiltX || 0;
    this.tiltY = props.tiltY || 0;
    this.pointerType = props.pointerType || "mouse";
    this.isPrimary = props.isPrimary || true;
  }
} as any;
