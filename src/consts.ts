const CSS_EXTS = ['css', 'scss', 'sass', 'less', 'styl', 'stylus', 'pcss', 'sss'];
const CSS_MODULES_FILE = `^[^?#]+\\.module\\.(?:${CSS_EXTS.join('|')})`;

const QUERY = {
    PUBLIC: ['module&inline', 'inline&module'],
    INTERNAL: '_at-jynxio-slash-vite-css-modules',
};

const FILTER = {
    TRANSFORM: new RegExp(`${CSS_MODULES_FILE}\\?${QUERY.INTERNAL}$`, 'i'),
    IMPORT: new RegExp(`${CSS_MODULES_FILE}\\?(?:${QUERY.PUBLIC.join('|')})$`, 'i'),
};

export { CSS_EXTS, FILTER, QUERY };
