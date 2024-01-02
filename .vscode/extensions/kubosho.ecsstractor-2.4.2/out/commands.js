"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCSSExtractor = void 0;
const vscode_1 = require("vscode");
const document_1 = require("./document");
const extractor_1 = require("./extractor");
const formatter_1 = require("./formatter");
const supportFileType_1 = require("./supportFileType");
const supportedFormats = Object.entries(supportFileType_1.SupportFileType).map(([_id, value]) => value);
async function runCSSExtractor() {
    const document = (0, document_1.getActiveDocument)();
    if (!document) {
        return;
    }
    const { languageId } = document;
    const isSupportedLanguage = supportedFormats.filter((format) => format === languageId).length > 0;
    if (!isSupportedLanguage) {
        vscode_1.window.showErrorMessage('eCSStractor: not supported format.');
        return;
    }
    const extractor = (0, extractor_1.createExtractor)(languageId);
    const content = document.getText();
    const selectors = [
        ...extractor.extractId(content),
        ...extractor.extractClassName(content),
    ];
    vscode_1.window.showTextDocument(await vscode_1.workspace.openTextDocument({
        content: (0, formatter_1.format)(selectors),
        language: 'css',
    }));
}
exports.runCSSExtractor = runCSSExtractor;
//# sourceMappingURL=commands.js.map