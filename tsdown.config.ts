import { join } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig } from 'tsdown';
import { write } from './packages/types';

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
            await write(join(cwd(), './dist/types.d.ts'));
        },
    },
});
