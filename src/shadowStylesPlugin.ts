import { resolve } from 'node:path';

import type { Plugin } from 'vite';

import { PLUGIN_NAME, SHADOW_STYLE_PLACEHOLDER } from './constants.ts';
import { dirname } from './utils/dirname.ts';
import { findCssFilesToInject } from './utils/findCssFilesToInject.ts';
import { findInjectionTargets } from './utils/findInjectionTargets.ts';
import { PluginError } from './utils/pluginError.ts';

export const shadowStylesPlugin = (
  command: 'build' | 'serve',
  mode: string,
): Plugin | undefined => ({
  name: PLUGIN_NAME,
  enforce: 'post',

  config(userConfig, env) {
    if (env.command === 'build') {
      if (userConfig.build?.cssCodeSplit) {
        throw new PluginError(`'build.cssCodeSplit' option is set to true, it must be false.`);
      }
    }
  },

  resolveId(id, importer, { isEntry }) {
    switch (id) {
      case 'virtual:shadow-styles/inject':
        return resolve(dirname(import.meta.url), 'injectCss.js');
      case 'virtual:shadow-styles/stylesheets':
        return resolve(dirname(import.meta.url), 'stylesheets.js');
      case 'virtual:shadow-styles/styles':
        if (isEntry || !importer) throw new Error(`${id} cannot be an entrypoint`);
        return '\0virtual:shadow-styles/styles';
    }
  },

  load(id) {
    if (id === '\0virtual:shadow-styles/styles') {
      // At dev time, styles will get copied from the `<head>` instead to take advantage of HMR
      if (command === 'serve' && !mode.includes('production')) return `export const css = ''`;

      return {
        code: `
        export const css = ${SHADOW_STYLE_PLACEHOLDER};
      `,
      };
    }
  },

  async generateBundle(_normalizedOutputOptions, outputBundle) {
    try {
      const injectionTargets = findInjectionTargets(outputBundle);
      const cssFilesToInject = findCssFilesToInject(outputBundle);
      if (cssFilesToInject.length > 1) {
        this.warn(
          'Multiple CSS files found in the output bundle. This plugin is intended for use only with a single CSS output file. ' +
            'Multiple CSS files will be concatenated into one injection snippet.' +
            `\n\nCSS files found: ${cssFilesToInject.map((c) => `\n* ${c.fileName}`).join('')}`,
        );
      }

      const escapedStyles = cssFilesToInject.reduce((concatenated, cssFile) => {
        if (typeof cssFile.source !== 'string')
          throw new PluginError(`The source of ${cssFile.fileName} is not a string.`);

        return concatenated + cssFile.source.replaceAll(/`/g, '\\`');
      }, '');

      // Swap the style placeholder with the style to inject.
      for (const injectionTarget of injectionTargets) {
        injectionTarget.code = injectionTarget.code.replaceAll(
          SHADOW_STYLE_PLACEHOLDER,
          `\`${escapedStyles}\``,
        );
      }
    } catch (error) {
      this.error((error as PluginError).message);
    }
  },
});
