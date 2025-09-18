import { dirname as pathDirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const dirname = (importMetaUrl: string) => pathDirname(fileURLToPath(importMetaUrl));
