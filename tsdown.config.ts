import { join } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig } from 'tsdown';
import { genTypes } from './scripts/gen-types';

export default defineConfig({
    exports: {
        customExports(pkg) {
            pkg['./types'] = './dist/types.d.ts';
            return pkg;
        },
    },
    entry: './packages/index.ts',
    hooks: {
        'build:done': async () => {
            await genTypes(join(cwd(), './dist/types.d.ts'));
        },
    },
});
