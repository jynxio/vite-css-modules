import { parseSync } from 'oxc-parser';
import { type Plugin } from 'vite';
import { FILTER, QUERY } from './consts';

function withCssModules(): Plugin[] {
    return [interceptImport(), interceptTransform()];

    function interceptImport(): Plugin {
        return {
            enforce: 'pre',
            name: 'vite-css-modules:import-interceptor',
            resolveId(id, importer) {
                if (!FILTER.IMPORT.test(id)) return null;

                return this.resolve(convertImportSpecifier(id), importer, { skipSelf: true });
            },
        };
    }

    function interceptTransform(): Plugin {
        return {
            enforce: 'post',
            name: 'vite-css-modules:transform-interceptor',
            transform: {
                filter: { id: FILTER.TRANSFORM },
                handler(code, id) {
                    const [pathPart] = splitImportSpecifier(id);
                    const [defaultExport, namedExports] = parseExport(code);
                    const declarations = [
                        `import inline from "${pathPart}?inline";`,
                        namedExports.join('\n'),
                        `const module = ${defaultExport};`,
                        'export { module, inline };',
                        'export default { module, inline };',
                    ];

                    return { map: null, code: declarations.join('\n') };
                },
            },
        };
    }
}

function splitImportSpecifier(importSpecifier: string): [pathPart: string, queryPart: string] {
    const firstIdx = importSpecifier.indexOf('?');
    const pathPart = importSpecifier.split('?')[0] ?? '';
    const queryPart = firstIdx === -1 ? '' : importSpecifier.slice(firstIdx + 1);

    return [pathPart, queryPart];
}

function convertImportSpecifier(importSpecifier: string) {
    const [pathPart, queryPart] = splitImportSpecifier(importSpecifier);

    if (QUERY.PUBLIC.includes(queryPart)) return `${pathPart}?${QUERY.INTERNAL}`;

    return importSpecifier;
}

function parseExport(code: string): [defaultExport: string, namedExports: string[]] {
    let defaultExport = '{}';
    const namedExports: string[] = [];
    const { module } = parseSync('noop.js', code);

    for (const { entries } of module.staticExports) {
        for (const entry of entries) {
            const { start, end } = entry;
            const kind = entry.exportName.kind;

            if (kind === 'Name') namedExports.push(code.slice(start, end));
            if (kind === 'Default') defaultExport = code.slice(start, end);
        }
    }

    return [defaultExport, namedExports];
}

export { withCssModules };
export default withCssModules;
