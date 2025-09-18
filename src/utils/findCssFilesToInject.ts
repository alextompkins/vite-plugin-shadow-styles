import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup';

import { PluginError } from './pluginError.ts';

const isInjectionCandidate = (outputFile: OutputAsset | OutputChunk): outputFile is OutputAsset =>
  !!outputFile.fileName?.includes('.css') && 'source' in outputFile;

/**
 * Scans the output bundle for a CSS file. If no CSS file is found, an error is
 * thrown.
 *
 * @param outputBundle {OutputBundle} - The output bundle to scan for a CSS file.
 * @returns {OutputAsset} - The CSS file found in the output bundle.
 * @throws {PluginError} - Throws an error if no CSS file is found in the output
 *   bundle, or multiple are found.
 */
export function findCssFilesToInject(outputBundle: OutputBundle): OutputAsset[] {
  const candidates = Object.values(outputBundle).filter(isInjectionCandidate);

  if (candidates.length === 0) throw new PluginError('No CSS files found in the output bundle!');

  return candidates;
}
