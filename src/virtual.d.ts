declare module 'virtual:shadow-styles/inject' {
  type CleanupFn = () => void;
  /**
   * Injects the bundled CSS into the given shadow root.
   *
   * See {@link shadowStylesPlugin} for details.
   */
  export function injectCss(shadowRoot: ShadowRoot): CleanupFn;
}

declare module 'virtual:shadow-styles/styles' {
  export const css: string;
}

declare module 'virtual:shadow-styles/stylesheets' {
  export const stylesheets: CSSStyleSheet[];
}
