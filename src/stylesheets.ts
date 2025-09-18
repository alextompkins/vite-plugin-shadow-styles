import { DATA_VITE_DEV_ID } from './constants.ts';

const sheet = new CSSStyleSheet();
export const stylesheets: CSSStyleSheet[] = [sheet];

const isViteStyleTag = (element: Element) =>
  element.tagName === 'STYLE' && element.hasAttribute(DATA_VITE_DEV_ID);

if (import.meta.hot) {
  // If we're in dev mode, we can listen to the `vite:afterUpdate` HMR event
  // This will tell us whenever Vite has updated a `<style>` in the `<head>`
  // We can then copy the styles appropriately
  const copyViteStylesFromHead = () => {
    const headStyleTags = [...document.head.children].filter(isViteStyleTag);
    const headStyles = headStyleTags.map((tag) => tag.innerHTML).join('\n');
    sheet.replaceSync(headStyles);
  };

  // Trigger once to copy initial styles
  copyViteStylesFromHead();
  import.meta.hot.on('vite:afterUpdate', () => copyViteStylesFromHead());
} else {
  // Otherwise, we set up a `<style>` tag which will include all bundled CSS
  import('virtual:shadow-styles/styles')
    .then(({ css }) => {
      sheet.replaceSync(css);
    })
    .catch((err) => console.error('Error loading styles', err));
}
