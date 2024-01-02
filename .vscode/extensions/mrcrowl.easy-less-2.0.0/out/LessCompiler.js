"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const less_1 = __importDefault(require("less"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const Configuration = __importStar(require("./Configuration"));
const FileOptionsParser = __importStar(require("./FileOptionsParser"));
const LessDocumentResolverPlugin_1 = require("./LessDocumentResolverPlugin");
const DEFAULT_EXT = '.css';
// compile the given less file
async function compile(lessFile, content, defaults, preprocessors = []) {
    var e_1, _a;
    const options = FileOptionsParser.parse(content, defaults);
    const lessPath = path.dirname(lessFile);
    // Option `main`.
    if (options.main) {
        // ###
        // When `main` is set: compile the referenced file(s) instead.
        const mainFilePaths = resolveMainFilePaths(options.main, lessPath, lessFile);
        if (mainFilePaths && mainFilePaths.length > 0) {
            for (const filePath of mainFilePaths) {
                const mainPath = path.parse(filePath);
                const mainRootFileInfo = Configuration.getRootFileInfo(mainPath);
                const mainDefaults = Object.assign(Object.assign({}, defaults), { rootFileInfo: mainRootFileInfo });
                const mainContent = await promises_1.default.readFile(filePath, { encoding: 'utf-8' });
                await compile(filePath, mainContent, mainDefaults);
            }
            return;
        }
    }
    // No output.
    if (options.out === null || options.out === false) {
        return;
    }
    // Option `out`
    const cssFilepath = chooseOutputFilename(options, lessFile, lessPath);
    delete options.out;
    // Option `sourceMap`.
    let sourceMapFile;
    if (options.sourceMap) {
        options.sourceMap = configureSourceMap(options, lessFile, cssFilepath);
        if (!options.sourceMap.sourceMapFileInline) {
            sourceMapFile = `${cssFilepath}.map`;
            options.sourceMap.sourceMapURL = `./${path.parse(sourceMapFile).base}`; // baseFilename + extension + ".map";
        }
    }
    // Option `autoprefixer`.
    options.plugins = [];
    if (options.autoprefixer) {
        const LessPluginAutoPrefix = require('less-plugin-autoprefix');
        const browsers = cleanBrowsersList(options.autoprefixer);
        const autoprefixPlugin = new LessPluginAutoPrefix({ browsers });
        options.plugins.push(autoprefixPlugin);
    }
    options.plugins.push(new LessDocumentResolverPlugin_1.LessDocumentResolverPlugin());
    if (preprocessors.length > 0) {
        // Clear options.rootFileInfo to ensure that less will not reload the content from the filepath again.
        delete options.rootFileInfo;
        // Used to cache some variables for use by other preprocessors.
        const ctx = new Map();
        try {
            for (var preprocessors_1 = __asyncValues(preprocessors), preprocessors_1_1; preprocessors_1_1 = await preprocessors_1.next(), !preprocessors_1_1.done;) {
                const p = preprocessors_1_1.value;
                content = await p(content, ctx);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (preprocessors_1_1 && !preprocessors_1_1.done && (_a = preprocessors_1.return)) await _a.call(preprocessors_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    // Render to CSS.
    const output = await less_1.default.render(content, options);
    await writeFileContents(cssFilepath, output.css);
    if (output.map && sourceMapFile) {
        await writeFileContents(sourceMapFile, output.map);
    }
}
exports.compile = compile;
function chooseOutputFilename(options, lessFile, lessPath) {
    const out = options.out;
    const extension = chooseExtension(options);
    const filenameNoExtension = path.parse(lessFile).name;
    let cssRelativeFilename;
    if (typeof out === 'string') {
        // Output to the specified file name.
        const interpolatedOut = intepolatePath(out.replace('$1', filenameNoExtension).replace('$2', extension), lessFile);
        cssRelativeFilename = interpolatedOut;
        if (isFolder(cssRelativeFilename)) {
            // Folder.
            cssRelativeFilename = `${cssRelativeFilename}${filenameNoExtension}${extension}`;
        }
        else if (hasNoExtension(cssRelativeFilename)) {
            // No extension, append manually.
            cssRelativeFilename = `${cssRelativeFilename}${extension}`;
        }
    }
    else {
        // `out` not set: output to the same basename as the less file
        cssRelativeFilename = filenameNoExtension + extension;
    }
    const cssFile = path.resolve(lessPath, cssRelativeFilename);
    return cssFile;
}
function isFolder(filename) {
    const lastCharacter = filename.slice(-1);
    return lastCharacter === '/' || lastCharacter === '\\';
}
function hasNoExtension(filename) {
    return path.extname(filename) === '';
}
function configureSourceMap(options, lessFile, cssFile) {
    // currently just has support for writing .map file to same directory
    const lessPath = path.parse(lessFile).dir;
    const cssPath = path.parse(cssFile).dir;
    const lessRelativeToCss = path.relative(cssPath, lessPath);
    const sourceMapOptions = {
        outputSourceFiles: false,
        sourceMapBasepath: lessPath,
        sourceMapFileInline: options.sourceMapFileInline,
        sourceMapRootpath: lessRelativeToCss,
    };
    return sourceMapOptions;
}
function cleanBrowsersList(autoprefixOption) {
    const browsers = Array.isArray(autoprefixOption) ? autoprefixOption : ('' + autoprefixOption).split(/,|;/);
    return browsers.map(browser => browser.trim());
}
function intepolatePath(path, lessFilePath) {
    if (path.includes('${workspaceFolder}')) {
        const lessFileUri = vscode.Uri.file(lessFilePath);
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(lessFileUri);
        if (workspaceFolder) {
            path = path.replace(/\$\{workspaceFolder\}/g, workspaceFolder.uri.fsPath);
        }
    }
    if (path.includes('${workspaceRoot}')) {
        if (vscode.workspace.rootPath) {
            path = path.replace(/\$\{workspaceRoot\}/g, vscode.workspace.rootPath);
        }
    }
    return path;
}
function resolveMainFilePaths(main, lessPath, currentLessFile) {
    let mainFiles;
    if (typeof main === 'string') {
        mainFiles = [main];
    }
    else if (Array.isArray(main)) {
        mainFiles = main;
    }
    else {
        mainFiles = [];
    }
    const interpolatedMainFilePaths = mainFiles.map(mainFile => intepolatePath(mainFile, lessPath));
    const resolvedMainFilePaths = interpolatedMainFilePaths.map(mainFile => path.resolve(lessPath, mainFile));
    if (resolvedMainFilePaths.indexOf(currentLessFile) >= 0) {
        // ###
        return []; // avoid infinite loops
    }
    return resolvedMainFilePaths;
}
// Writes a file's contents to a path and creates directories if they don't exist.
async function writeFileContents(filepath, content) {
    await promises_1.default.mkdir(path.dirname(filepath), { recursive: true });
    await promises_1.default.writeFile(filepath, content.toString());
}
function chooseExtension(options) {
    if (options === null || options === void 0 ? void 0 : options.outExt) {
        if (options.outExt === '') {
            // Special case for no extension (no idea if anyone would really want this?).
            return '';
        }
        return ensureDotPrefixed(options.outExt) || DEFAULT_EXT; // ###
    }
    return DEFAULT_EXT;
}
function ensureDotPrefixed(extension) {
    if (extension.startsWith('.')) {
        return extension;
    }
    return extension ? `.${extension}` : ''; // ###
}
//# sourceMappingURL=LessCompiler.js.map