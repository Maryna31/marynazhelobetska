"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const formatter_1 = require("../formatter");
(0, ava_1.default)('format selectors', (t) => {
    const selectors = ['.article.content', '.article.title', '.article.title'];
    const actual = (0, formatter_1.format)(selectors);
    const expected = `.article.content {
}
.article.title {
}
`;
    t.is(actual, expected);
});
//# sourceMappingURL=test_formatter.js.map