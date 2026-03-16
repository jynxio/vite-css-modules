import fs from 'fs-extra';
import childProcess from 'node:child_process';
import path from 'node:path';
import { cwd } from 'node:process';

const TEMP_PATH = path.join(cwd(), '.temp');

main();

function main() {
    build();
    stage();
    publish();
}

function stage() {
    fs.emptyDirSync(TEMP_PATH);
    fs.copySync(src('dist'), dest('dist'));
    fs.copySync(src('LICENSE'), dest('LICENSE'));
    fs.copySync(src('README.npm.md'), dest('README.md'));

    const pkg = fs.readJSONSync(src('package.json'));

    delete pkg.scripts;
    fs.writeJSONSync(dest('package.json'), pkg);

    function src(fileOrDirName: string) {
        return path.join(cwd(), fileOrDirName);
    }

    function dest(fileOrDirName: string) {
        return path.join(TEMP_PATH, fileOrDirName);
    }
}

function build() {
    childProcess.execFileSync('pnpm', ['build'], { cwd: cwd(), stdio: 'inherit' });
}

function publish() {
    childProcess.execFileSync('pnpm', ['publish', '--access', 'public'], {
        cwd: TEMP_PATH,
        stdio: 'inherit',
    });
}
