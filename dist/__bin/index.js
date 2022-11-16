#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var ObjectUtils_1 = require("yayaluoya-tool/dist/obj/ObjectUtils");
var getAbsolute_1 = require("../utils/getAbsolute");
var getOp_1 = require("./getOp");
var getConfig_1 = require("../config/getConfig");
var getConfig_2 = require("../config/getConfig");
var cmdSecondCom_1 = require("yayaluoya-tool/dist/node/cmdSecondCom");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var defaultConfig, _a, _b, opts, _c, p, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var _v, _w;
    return __generator(this, function (_x) {
        switch (_x.label) {
            case 0:
                _b = (_a = ObjectUtils_1.ObjectUtils).clone2;
                return [4 /*yield*/, getConfig_1.defaultConfig];
            case 1:
                defaultConfig = _b.apply(_a, [_x.sent()]);
                opts = (0, getOp_1.getOp)();
                _c = true;
                switch (_c) {
                    case Boolean(opts.version): return [3 /*break*/, 2];
                    case Boolean(opts.help): return [3 /*break*/, 3];
                    case Boolean(opts.init): return [3 /*break*/, 4];
                    case Boolean(opts.debugConfig): return [3 /*break*/, 5];
                }
                return [3 /*break*/, 10];
            case 2:
                console.log(chalk_1.default.green('当前sfs版本@ ') + chalk_1.default.yellow(getConfig_1.packageJSON.version));
                return [3 /*break*/, 15];
            case 3:
                console.log('\n');
                console.log(chalk_1.default.hex('#d2e603')('sfs的所有命令😀:'));
                console.log(chalk_1.default.green('   -v --version ') + chalk_1.default.gray('查看当前工具版本'));
                console.log(chalk_1.default.green('   -h --help ') + chalk_1.default.gray('查看所有的命令和帮助信息'));
                console.log(chalk_1.default.green('   -i --init ') + chalk_1.default.gray('在当前执行目录下生成默认配置文件'));
                console.log(chalk_1.default.green('   -c --config <path> ') + chalk_1.default.gray('用指定配置文件来运行'));
                console.log(chalk_1.default.green('   -dc --debug-config [path] ') + chalk_1.default.gray('查看某个配置文件'));
                console.log(chalk_1.default.green('   -k --keys <keys> ') + chalk_1.default.gray('指定配置列表中的那些项目参与此次同步，多个项目用,，号分隔'));
                console.log(chalk_1.default.green('   -d --demo ') + chalk_1.default.gray('同步时需要再次确定才会真正同步，在重要场合加上这个参数可以防止出错'));
                console.log('----');
                console.log(chalk_1.default.yellow('sfs的使用方式⚡：'));
                console.log(chalk_1.default.gray('    完整命令为server-file-sync，快捷命令为sfs'));
                console.log(chalk_1.default.gray('    默认自定义配置是当前工具执行路径下的sfs.config.js文件，可以执行sfs -i 快速生成配置文件'));
                return [3 /*break*/, 15];
            case 4:
                p = Promise.resolve();
                if ((_v = fs_1.default.statSync(getConfig_1.projectConfigUrl, {
                    throwIfNoEntry: false,
                })) === null || _v === void 0 ? void 0 : _v.isFile()) {
                    p = (0, cmdSecondCom_1.cmdSecondCom)("\u5DF2\u7ECF\u5B58\u5728\u914D\u7F6E\u6587\u4EF6\u4E86".concat(getConfig_1.projectConfigUrl, "\uFF0C\u662F\u5426\u8986\u76D6 \u662F:y/Y \u8F93\u5165\u5176\u4ED6\u5B57\u7B26\u53D6\u6D88: ")).then(function (input) {
                        if (!/^y$/i.test(input)) {
                            throw '';
                        }
                    });
                }
                p.then(function () {
                    fs_1.default.createReadStream(path_1.default.join(__dirname, '../../config_tem.js')).pipe(fs_1.default.createWriteStream(getConfig_1.projectConfigUrl));
                    console.log(chalk_1.default.green("\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u6210\u529F ".concat(getConfig_1.projectConfigUrl)));
                }).catch(function () {
                    console.log('已取消');
                });
                return [3 /*break*/, 15];
            case 5:
                console.log(chalk_1.default.yellow('配置信息：'));
                if (!(typeof opts.debugConfig == 'string')) return [3 /*break*/, 7];
                _e = (_d = console).dir;
                _g = (_f = ObjectUtils_1.ObjectUtils).merge;
                _h = [defaultConfig];
                return [4 /*yield*/, (0, getConfig_2.getConfig)((0, getAbsolute_1.getAbsolute)(opts.debugConfig), '配置文件导入错误!')];
            case 6:
                _e.apply(_d, [_g.apply(_f, _h.concat([_x.sent()])),
                    { depth: null }]);
                return [3 /*break*/, 9];
            case 7:
                _k = (_j = console).dir;
                _m = (_l = ObjectUtils_1.ObjectUtils).merge;
                _o = [defaultConfig];
                return [4 /*yield*/, (0, getConfig_1.getCwdConfig)()];
            case 8:
                _k.apply(_j, [_m.apply(_l, _o.concat([_x.sent()])),
                    { depth: null }]);
                _x.label = 9;
            case 9: return [3 /*break*/, 15];
            case 10:
                if (!Boolean(opts.config)) return [3 /*break*/, 12];
                _q = (_p = ObjectUtils_1.ObjectUtils).merge;
                _r = [defaultConfig];
                return [4 /*yield*/, (0, getConfig_2.getConfig)((0, getAbsolute_1.getAbsolute)(opts.config), '配置文件导入错误，将以默认配置运行!')];
            case 11:
                _q.apply(_p, _r.concat([_x.sent()]));
                return [3 /*break*/, 14];
            case 12:
                _t = (_s = ObjectUtils_1.ObjectUtils).merge;
                _u = [defaultConfig];
                return [4 /*yield*/, (0, getConfig_1.getCwdConfig)()];
            case 13:
                _t.apply(_s, _u.concat([_x.sent()]));
                _x.label = 14;
            case 14:
                //正式运行
                (0, __1.start)(defaultConfig, (_w = opts.keys) === null || _w === void 0 ? void 0 : _w.split(/[,，]/), opts.demo);
                _x.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map