"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsxExtractor = void 0;
const typescript_estree_1 = require("@typescript-eslint/typescript-estree");
class JsxExtractor {
    extractClassName(contents) {
        const result = [];
        const ast = (0, typescript_estree_1.parse)(contents, { jsx: true });
        (0, typescript_estree_1.simpleTraverse)(ast, {
            enter: (node) => {
                if (node.type === 'JSXElement') {
                    result.push(...this._extractClassNameFromJSXElement(node));
                }
                if (node.type === 'JSXExpressionContainer') {
                    result.push(...this._extractClassNameFromJSXExpressionContainer(node));
                }
            },
        });
        return result;
    }
    extractId(contents) {
        const result = [];
        const ast = (0, typescript_estree_1.parse)(contents, { jsx: true });
        (0, typescript_estree_1.simpleTraverse)(ast, {
            enter: (node) => {
                if (node.type === 'JSXElement') {
                    result.push(...this._extractId(node));
                }
            },
        });
        return result;
    }
    _extractClassNameFromJSXElement(element) {
        const { openingElement } = element;
        const { attributes } = openingElement;
        return attributes
            .filter((attr) => attr.type === 'JSXAttribute' && attr.name.name === 'className')
            .flatMap(({ value }) => {
            if (value?.type !== 'Literal' || typeof value.value !== 'string') {
                return [];
            }
            return `.${value.value.replace(/ /g, '.')}`;
        });
    }
    _extractClassNameFromJSXExpressionContainer({ expression, }) {
        if (expression.type !== 'CallExpression' ||
            !expression.callee ||
            expression.callee.type !== 'Identifier' ||
            expression.callee.name !== 'classNames') {
            return [];
        }
        const result1 = expression.arguments
            .filter((value) => value.type === 'Literal')
            .map(({ value }) => `.${value}`);
        const result2 = expression.arguments
            .filter((value) => value.type === 'ObjectExpression')
            .flatMap(({ properties }) => properties)
            .filter((property) => property.type === 'Property')
            .flatMap((property) => property.key.type === 'Literal' ? `.${property.key.value}` : []);
        return [...result1, ...result2];
    }
    _extractId(element) {
        const { openingElement } = element;
        const { attributes } = openingElement;
        return attributes
            .filter((attr) => attr.type === 'JSXAttribute' && attr.name.name === 'id')
            .flatMap(({ value }) => {
            if (value?.type !== 'Literal') {
                return [];
            }
            return `#${value.value}`;
        });
    }
}
exports.JsxExtractor = JsxExtractor;
//# sourceMappingURL=jsx_extractor.js.map