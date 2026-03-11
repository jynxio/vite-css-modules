import fs from 'fs-extra';
import { CSS_EXTS } from './_consts';

function writeTypeDeclaration(destination: string): Promise<void> {
    return fs.outputFile(destination, createTypeDeclaration());
}

function createTypeDeclaration(): string {
    const declarations: string[] = [];

    for (const ext of CSS_EXTS) {
        const lines = [
            `declare module '*.module.${ext}?isolate' {`,
            'const inline: string;',
            'const module: { readonly [k in string]: string };',
            'const collection: { inline; module };',
            '',
            'export { inline, module };',
            'export default collection;',
            '}',
        ];

        declarations.push(lines.join('\n'));
    }

    return declarations.join('\n').trim();
}

export { writeTypeDeclaration as write };
