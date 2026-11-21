// Resolve hook so @concordium/wallet-connectors loads under Node ESM
// (extensionless relative imports and package directory imports).
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (e) {
    if (e.code === 'ERR_UNSUPPORTED_DIR_IMPORT' && e.url) {
      const dir = e.url.startsWith('file://') ? new URL(e.url).pathname : e.url;
      for (const cand of ['index.js', 'index.cjs', 'index.mjs']) {
        const p = path.join(dir, cand);
        if (fs.existsSync(p)) {
          return { shortCircuit: true, url: pathToFileURL(p).href };
        }
      }
    }
    if (specifier.startsWith('.') && !/\.(js|mjs|cjs|json)$/.test(specifier)) {
      try {
        return await nextResolve(specifier + '.js', context);
      } catch (_) {
        // fall through
      }
    }
    throw e;
  }
}
