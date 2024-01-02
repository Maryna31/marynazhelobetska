"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveDocument = void 0;
const vscode_1 = require("vscode");
function getActiveDocument() {
    const { activeTextEditor } = vscode_1.window;
    if (!activeTextEditor) {
        return;
    }
    const { document } = activeTextEditor;
    return document;
}
exports.getActiveDocument = getActiveDocument;
//# sourceMappingURL=document.js.map