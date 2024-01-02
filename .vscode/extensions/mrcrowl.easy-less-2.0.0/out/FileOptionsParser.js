"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const SUPPORTED_PER_FILE_OPTS = new Set([
    'main',
    'out',
    'outExt',
    'sourceMap',
    'sourceMapFileInline',
    'compress',
    'relativeUrls',
    'ieCompat',
    'autoprefixer',
    'javascriptEnabled',
    'math',
]);
const MULTI_OPTS = new Set(['main']);
function parse(line, defaults) {
    // Does line start with "//"?
    const commentMatch = /^\s*\/\/\s*(.+)/.exec(line);
    if (!commentMatch) {
        return defaults;
    }
    const options = Object.assign({}, defaults);
    const seenKeys = new Set();
    for (const item of commentMatch[1].split(',')) {
        const [key, rawValue] = splitOption(item);
        // Guard.
        if (!SUPPORTED_PER_FILE_OPTS.has(key))
            continue;
        if (rawValue === undefined || rawValue === '')
            continue;
        // Interpret value.
        const value = parsePrimitive(rawValue);
        if (seenKeys.has(key) && MULTI_OPTS.has(key)) {
            // Handle multiple values for same key.
            const existingValue = options[key];
            if (Array.isArray(existingValue)) {
                existingValue.push(value);
            }
            else {
                options[key] = [existingValue, value];
            }
        }
        else {
            // Single value, or key doesn't allow an array.
            options[key] = value;
            seenKeys.add(key);
        }
    }
    return options;
}
exports.parse = parse;
function splitOption(item) {
    var _a, _b;
    const parts = item.split(':', 2);
    const key = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.trim();
    const value = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.trim();
    return [key, value];
}
function parsePrimitive(rawValue) {
    if (rawValue.match(/^(true|false|undefined|null|[0-9]+)$/)) {
        return eval(rawValue);
    }
    if (isEnclosedInQuotes(rawValue)) {
        try {
            return eval(rawValue);
        }
        catch (e) {
            return rawValue;
        }
    }
    return rawValue;
}
const SINGLE_QUOTE = "'";
const DOUBLE_QUOTE = '"';
function isEnclosedInQuotes(value) {
    return (typeof value === 'string' &&
        value.length > 1 &&
        ((value.startsWith(DOUBLE_QUOTE) && value.endsWith(DOUBLE_QUOTE)) ||
            (value.startsWith(SINGLE_QUOTE) && value.endsWith(SINGLE_QUOTE))));
}
//# sourceMappingURL=FileOptionsParser.js.map