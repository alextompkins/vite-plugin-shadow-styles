import { DATA_VITE_DEV_ID } from './constants.ts';

const isViteStyleTag = (element: Element) =>
  element.tagName === 'STYLE' && element.hasAttribute(DATA_VITE_DEV_ID);

const getId = (styleEl: Element) => styleEl.getAttribute(DATA_VITE_DEV_ID);

type CleanupFn = () => void;

export function injectCss(shadowRoot: ShadowRoot): CleanupFn {
  if (import.meta.hot) {
    // If we're in dev mode, we can listen to the `vite:afterUpdate` HMR event
    // This will tell us whenever Vite has updated a style in the `<head>`
    // We can then copy the `<style>`s appropriately
    const copyViteStylesFromHead = () => {
      const headStyles = [...document.head.children].filter(isViteStyleTag);
      const shadowRootStyles = [...shadowRoot.children].filter(isViteStyleTag);

      for (const headStyle of headStyles) {
        const matching = shadowRootStyles.find(
          (existingStyle) => getId(existingStyle) == getId(headStyle),
        );

        // If no existing match for this style exists, then clone it into the shadow root
        if (!matching) {
          console.debug(`Adding to shadow root:`, getId(headStyle));
          const cloned = headStyle.cloneNode(true);
          shadowRoot.appendChild(cloned);
        }

        // If there is a match but the contents are different, then update it in the shadow root
        else if (headStyle.innerHTML !== matching.innerHTML) {
          console.debug(`Updating in shadow root:`, getId(headStyle));
          matching.innerHTML = headStyle.innerHTML;
        }
      }

      // Finally, we need to figure out which are no longer relevant and need to be deleted
      const idsInHead = headStyles.map(getId);
      const toRemove = shadowRootStyles.filter(
        (existingStyle) => !idsInHead.includes(getId(existingStyle)),
      );
      toRemove.forEach((style) => {
        console.debug(`Removing from shadow root:`, getId(style));
        shadowRoot.removeChild(style);
      });
    };

    // Trigger once to copy initial styles
    copyViteStylesFromHead();
    import.meta.hot.on('vite:afterUpdate', copyViteStylesFromHead);

    return () => import.meta?.hot?.off('vite:afterUpdate', copyViteStylesFromHead);
  } else {
    // Otherwise, we set up a `<style>` tag which will include all bundled CSS
    import('virtual:shadow-styles/styles')
      .then(({ css }) => {
        const styleEl = document.createElement('style');
        styleEl.appendChild(document.createTextNode(css));
        shadowRoot.appendChild(styleEl);
      })
      .catch((err) => console.error('Error loading styles', err));

    return () => {};
  }
}
