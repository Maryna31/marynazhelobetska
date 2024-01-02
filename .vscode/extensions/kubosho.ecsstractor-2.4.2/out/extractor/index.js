"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExtractor = void 0;
const supportFileType_1 = require("../supportFileType");
const html_extractor_1 = require("./html_extractor");
const jsx_extractor_1 = require("./jsx_extractor");
class ExtractorImpl {
    constructor(fileType) {
        this._htmlExtractor = new html_extractor_1.HtmlExtractor();
        this._jsxExtractor = new jsx_extractor_1.JsxExtractor();
        this._filetype = fileType;
    }
    extractClassName(contents) {
        if (this._filetype === supportFileType_1.SupportFileType.Html) {
            return this._htmlExtractor.extractClassName(contents);
        }
        return this._jsxExtractor.extractClassName(contents);
    }
    extractId(contents) {
        if (this._filetype === supportFileType_1.SupportFileType.Html) {
            return this._htmlExtractor.extractId(contents);
        }
        return this._jsxExtractor.extractId(contents);
    }
}
function createExtractor(fileType) {
    return new ExtractorImpl(fileType);
}
exports.createExtractor = createExtractor;
//# sourceMappingURL=index.js.map