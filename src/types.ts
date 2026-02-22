import fs from 'fs-extra';
import { CSS_EXTS, QUERY } from './consts';

function writeTypeDeclaration(destination: string): Promise<void> {
    return fs.outputFile(destination, createTypeDeclaration());
}

function createTypeDeclaration(): string {
    const declarations: string[] = [];

    for (const ext of CSS_EXTS) {
        for (const query of QUERY.PUBLIC) {
            const lines = [
                `declare module '*.module.${ext}?${query}' {`,
                'const inline: string;',
                'const module: Readonly<Record<string, string>>;',
                'const result: { module, inline };',
                'export { module, inline }',
                'export default result;',
                '}',
            ];

            declarations.push(lines.join('\n'));
        }
    }

    return declarations.join('\n').trim();
}

export { writeTypeDeclaration as write };
