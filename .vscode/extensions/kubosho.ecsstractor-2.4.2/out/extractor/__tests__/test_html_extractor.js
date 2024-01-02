"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const fs_1 = require("fs");
const util_1 = require("util");
const html_extractor_1 = require("../html_extractor");
const readFile = (0, util_1.promisify)(fs_1.readFile);
(0, ava_1.default)('HTML: extract class selectors', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/html/list.html`, 'utf8');
    const extractor = new html_extractor_1.HtmlExtractor();
    const actual = extractor.extractClassName(content);
    t.is(actual.length, 6);
    t.is(actual[0], '.list');
    t.is(actual[1], '.list-item');
});
(0, ava_1.default)('HTML: extract multiple class selectors', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/html/multiple-classes.html`, 'utf8');
    const extractor = new html_extractor_1.HtmlExtractor();
    const actual = extractor.extractClassName(content);
    t.is(actual.length, 3);
    t.is(actual[0], '.container.container-fluid.article');
    t.is(actual[1], '.article.content');
    t.is(actual[2], '.article.title');
});
(0, ava_1.default)('HTML: extract id selectors', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/html/id.html`, 'utf8');
    const extractor = new html_extractor_1.HtmlExtractor();
    const actual = extractor.extractId(content);
    t.is(actual.length, 3);
    t.is(actual[0], '#global-header');
    t.is(actual[1], '#global-footer');
    t.is(actual[2], '#site-title');
});
//# sourceMappingURL=test_html_extractor.js.map