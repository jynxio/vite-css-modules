import pkg from '$/package.json';
import { parseSync } from 'oxc-parser';
import { type CSSModulesOptions, type Plugin } from 'vite';
import { CSS_EXTS } from './consts';

const PUBLIC_QUERY = 'isolate';
const PRIVATE_QUERY = 'inline&_at-jynxio-slash-vite-css-modules';

const PUBLIC_ID_RE = new RegExp(
    String.raw`^(?:[^?]+)\.module\.(?:${CSS_EXTS.join('|')})\?${PUBLIC_QUERY}$`,
);
const PRIVATE_ID_RE = new RegExp(
    String.raw`^(?:[^?]+)\.module\.(?:${CSS_EXTS.join('|')})\?${PRIVATE_QUERY}$`,
);

function cssModules(): Plugin[] {
    const cssModulesSpy = new Map<string, { readonly [k in string]: string }>();

    return [interceptConfig(), interceptImport(), interceptTransform()];

    function interceptConfig(): Plugin {
        return {
            enforce: 'pre',
            name: '@jynxio/vite-css-modules:intercept-config',
            config(userConfig) {
                const userGetJSON = (userConfig.css?.modules || {}).getJSON;
                const spyingGetJSON = ((cssFileName, json, outputFileName) => {
                    userGetJSON?.(cssFileName, json, outputFileName);
                    cssModulesSpy.set(cssFileName, json);
                }) satisfies CSSModulesOptions['getJSON'];

                return { css: { modules: { getJSON: spyingGetJSON } } };
            },
            configResolved(resolvedConfig) {
                if (resolvedConfig.css.transformer !== 'postcss')
                    return fail(
                        'Lightning CSS is not supported. Use PostCSS instead (hint: set `css.transformer` to `"postcss"`).',
                    );

                if (resolvedConfig.css.modules === false)
                    return fail(
                        'CSS Modules are disabled. Enable them to use this plugin (hint: remove `css.modules: false`).',
                    );
            },
        };
    }

    function interceptImport(): Plugin {
        return {
            enforce: 'pre',
            name: '@jynxio/vite-css-modules:intercept-import',
            resolveId(id, importer) {
                if (!PUBLIC_ID_RE.test(id)) return null;

                const pathPart = id.split('?')[0];
                const newId = `${pathPart}?${PRIVATE_QUERY}`;

                return this.resolve(newId, importer, { skipSelf: true });
            },
        };
    }

    function interceptTransform(): Plugin {
        return {
            enforce: 'post',
            name: '@jynxio/vite-css-modules:intercept-transform',
            transform: {
                filter: { id: PRIVATE_ID_RE },
                handler(code, id) {
                    const inline = parseDefaultExport(code);
                    const module = cssModulesSpy.get(id) || {};
                    const declarations = [
                        `const module = ${JSON.stringify(module)};`,
                        `const inline = ${inline};`,
                        'export { module, inline };',
                        'export default { module, inline };',
                    ];

                    return { map: null, code: declarations.join('\n') };
                },
            },
        };
    }
}

function fail(msg: string): never {
    throw new Error(`[${pkg.name}] ${msg}`);
}

function parseDefaultExport(code: string): string {
    const { module } = parseSync('noop.js', code);

    for (const { entries } of module.staticExports) {
        for (const entry of entries) {
            const { start, end } = entry;
            const kind = entry.exportName.kind;

            if (kind === 'Default') return code.slice(start, end);
        }
    }

    return '{}';
}

export { cssModules };
export default cssModules;
