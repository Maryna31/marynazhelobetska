"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const fs_1 = require("fs");
const util_1 = require("util");
const jsx_extractor_1 = require("../jsx_extractor");
const readFile = (0, util_1.promisify)(fs_1.readFile);
(0, ava_1.default)('TSX: extract class selectors', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/list.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    const actual = extractor.extractClassName(content);
    t.is(actual.length, 6);
    t.is(actual[0], '.list');
    t.is(actual[1], '.list-item');
});
(0, ava_1.default)('TSX: default export case', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/default-export.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    const actual = extractor.extractClassName(content);
    t.is(actual.length, 6);
    t.is(actual[0], '.list');
    t.is(actual[1], '.list-item');
});
(0, ava_1.default)('TSX: export variable case', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/export-with-variable.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    const actual = extractor.extractClassName(content);
    t.is(actual.length, 6);
    t.is(actual[0], '.list');
    t.is(actual[1], '.list-item');
});
(0, ava_1.default)('TSX: extract multiple class selectors', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/multiple-classes.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    const actual = extractor.extractClassName(content);
    t.is(actual.length, 3);
    t.is(actual[0], '.container.container-fluid.article');
    t.is(actual[1], '.article.content');
    t.is(actual[2], '.article.title');
});
(0, ava_1.default)('TSX: extract id selectors', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/id.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    const actual = extractor.extractId(content);
    t.is(actual.length, 3);
    t.is(actual[0], '#global-header');
    t.is(actual[1], '#site-title');
    t.is(actual[2], '#global-footer');
});
(0, ava_1.default)('TSX: with hooks', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/with-hooks.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    {
        const actual = [
            ...extractor.extractId(content),
            ...extractor.extractClassName(content),
        ];
        t.is(actual.length, 2);
        t.is(actual[0], '#container');
        t.is(actual[1], '.container');
    }
});
(0, ava_1.default)('TSX: with classnames library', async (t) => {
    const content = await readFile(`${process.cwd()}/testcases/tsx/with-classnames.tsx`, 'utf8');
    const extractor = new jsx_extractor_1.JsxExtractor();
    {
        const actual = [
            ...extractor.extractId(content),
            ...extractor.extractClassName(content),
        ];
        t.is(actual.length, 3);
        t.is(actual[0], '#container');
        t.is(actual[1], '.container');
        t.is(actual[2], '.container--modifier');
    }
});
//# sourceMappingURL=test_jsx_extractor_for_tsx.js.map