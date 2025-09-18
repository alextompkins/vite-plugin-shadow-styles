# `vite-plugin-shadow-styles`

A plugin that provides some handy utilities to inject styles into a shadow root.

## Usage

First, include the plugin in your Vite config:

```typescript
import type { defineConfig, UserConfig } from 'vite';
import { shadowStylesPlugin } from 'vite-plugin-shadow-styles';

export default defineConfig(async ({ command, mode }) => ({
  build: {
    // must be false, since all CSS files are concatenated into the virtual styles
    cssCodeSplit: false,
  },
  plugins: [shadowStylesPlugin(command, mode)],
}));
```

---

Then, choose one of these methods:

### `stylesheets`

```typescript
import { stylesheets } from 'virtual:shadow-styles/stylesheets';

const webComponent = document.querySelector('my-web-component');
webComponent.shadowRoot.adoptedStyleSheets = stylesheets;
```

On HMR, the contents of `stylesheets` will be mutated to reflect the style tags in `<head>`.

### `injectCss`

```typescript
import { injectCss } from 'virtual:shadow-styles/inject';

const webComponent = document.querySelector('my-web-component');
injectCss(webComponent.shadowRoot);
```

On HMR, style tags will be copied from `<head>` into the shadow root.

### `styles`

```typescript
import { css } from 'virtual:shadow-styles/styles';

const styleTag = document.createElement('style');
styleTag.innerHTML = css;

const webComponent = document.querySelector('my-web-component');
webComponent.shadowRoot.appendChild(styleTag);
```

Note: `css` will _not_ update on HMR using this method.
