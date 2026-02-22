import { join } from 'node:path';
import { cwd } from 'node:process';
import { defineConfig } from 'tsdown';
import { write } from './src/types';

export default defineConfig({
    exports: {
        customExports(pkg) {
            pkg['./types'] = './dist/types.d.ts';
            return pkg;
        },
    },
    entry: './src/index.ts',
    hooks: {
        'build:done': async () => {
            await write(join(cwd(), './dist/types.d.ts'));
        },
    },
});
