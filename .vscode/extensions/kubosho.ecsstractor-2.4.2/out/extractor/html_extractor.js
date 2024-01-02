"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlExtractor = void 0;
const domhandler_1 = require("domhandler");
const htmlparser2_1 = require("htmlparser2");
class HtmlExtractor {
    extractClassName(contents) {
        const root = (0, htmlparser2_1.parseDocument)(contents);
        return this._extractClassName(root.children);
    }
    extractId(contents) {
        const root = (0, htmlparser2_1.parseDocument)(contents);
        return this._extractId(root.children);
    }
    _extractClassName(children, classNamesArg = []) {
        const elements = children.flatMap((child) => ((0, domhandler_1.isTag)(child) ? [child] : []));
        if (elements.length === 0) {
            return classNamesArg;
        }
        const classNames = classNamesArg.concat(getClassNames(elements));
        return this._extractClassName(elements.flatMap((element) => element.children), classNames);
    }
    _extractId(children, idsArg = []) {
        const elements = children.flatMap((child) => ((0, domhandler_1.isTag)(child) ? [child] : []));
        if (elements.length === 0) {
            return idsArg;
        }
        const ids = idsArg.concat(getIds(elements));
        return this._extractId(elements.flatMap((element) => element.children), ids);
    }
}
exports.HtmlExtractor = HtmlExtractor;
function getClassNames(elements) {
    const classNames = elements
        .map((child) => child.attribs.class)
        .filter((className) => !!className)
        .map((className) => `.${className.replace(/ /g, '.')}`);
    return classNames;
}
function getIds(elements) {
    const ids = elements
        .map((child) => child.attribs.id)
        .filter((id) => !!id)
        .map((id) => `#${id}`);
    return ids;
}
//# sourceMappingURL=html_extractor.js.map