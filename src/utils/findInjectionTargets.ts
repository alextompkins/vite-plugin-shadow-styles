import type { OutputAsset, OutputBundle, OutputChunk } from 'rollup';

import { SHADOW_STYLE_PLACEHOLDER } from '../constants.ts';
import { PluginError } from './pluginError.ts';

const isInjectionTarget = (outputFile: OutputAsset | OutputChunk): outputFile is OutputChunk =>
  'code' in outputFile && outputFile.code.includes(SHADOW_STYLE_PLACEHOLDER);

/**
 * Scans the output bundle for a JS file flagged as entry point. If more than
 * one JS file is found, an error is thrown.
 *
 * @param outputBundle {OutputBundle} - The output bundle to scan for a CSS file.
 * @returns {OutputChunk} - The JS file found in the output bundle.
 * @throws {PluginError} - Throws an error if more no entry point JS file is
 *   found in the output bundle.
 */
export function findInjectionTargets(outputBundle: OutputBundle): OutputChunk[] {
  const injectionTargets = Object.values(outputBundle).filter(isInjectionTarget);

  if (injectionTargets.length === 0) throw new PluginError('Injection target not found!');

  return injectionTargets;
}
