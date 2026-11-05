export {};

declare global {
  interface Window {
    Charts: {
      line: (el: HTMLElement, options: Record<string, unknown>) => unknown;
      fmt: Record<string, unknown>;
    };
  }
}
