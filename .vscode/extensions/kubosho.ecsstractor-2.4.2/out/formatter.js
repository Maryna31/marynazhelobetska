"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const prettier_1 = require("prettier");
function format(selectors) {
    const source = convertSelectorsToRulesets(selectors);
    return (0, prettier_1.format)(source, { parser: 'css' });
}
exports.format = format;
function convertSelectorsToRulesets(selectors) {
    const s = removeDuplicatesSelector(selectors);
    return s.map((selector) => `${selector}{}`).join(' ');
}
function removeDuplicatesSelector(selectors) {
    return [...new Set(selectors)];
}
//# sourceMappingURL=formatter.js.map