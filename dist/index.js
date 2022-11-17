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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.start = void 0;
var Manager_1 = require("./Manager");
var chalk_1 = __importDefault(require("chalk"));
var syncDF_1 = require("./syncDF");
var getAbsolute_1 = require("./utils/getAbsolute");
var watchDf_1 = require("./watchDf");
var getComPath_1 = require("./utils/getComPath");
var ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
var IConfig_1 = require("./config/IConfig");
var cmdSecondCom_1 = require("yayaluoya-tool/dist/node/cmdSecondCom");
/**
 * 开始
 */
function start(config, keys, demo) {
    if (demo === void 0) { demo = false; }
    //TODO 防😳
    config.syncList = ArrayUtils_1.ArrayUtils.arraify(config.syncList || []);
    config.syncList.forEach(function (_) {
        _.paths = ArrayUtils_1.ArrayUtils.arraify(_.paths);
    });
    // 数组化
    keys = ArrayUtils_1.ArrayUtils.arraify(keys);
    //对config中的列表做判断
    if (keys && keys.length > 0) {
        config.syncList = config.syncList.filter(function (_) {
            return keys.includes(_.key);
        });
    }
    if (config.syncList.length <= 0) {
        console.log(chalk_1.default.red('没有需要同步的内容，请在配置syncList中添加需要同步的列表，或者 -s 的参数没传对'));
        return;
    }
    console.log('需要同步的列表:');
    console.dir(config.syncList.map(function (_) {
        var key = _.key, title = _.title, paths = _.paths;
        return {
            key: key,
            title: title,
            pathLenth: paths.length,
        };
    }), {
        depth: null,
    });
    //如果是演示的话需要再次确定
    if (demo) {
        for (var _i = 0, _a = config.syncList; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b.key, title = _b.title, paths = _b.paths;
            for (var _c = 0, paths_1 = paths; _c < paths_1.length; _c++) {
                var _d = paths_1[_c], local = _d.local, remote = _d.remote;
                console.log(chalk_1.default.yellow("\u540C\u6B65\u6F14\u793A->".concat(title, "@").concat(key, ": ").concat((0, getAbsolute_1.getAbsolute)(local), " -> ").concat((0, getComPath_1.getComPath)(remote))));
            }
        }
        (0, cmdSecondCom_1.cmdSecondCom)('上传:y/Y,演示:d/D 输入其它字符取消: ').then(function (name) {
            switch (true) {
                /** 上传 */
                case /^y$/i.test(name):
                    upload(config);
                    break;
                /** 演示 */
                case /^d$/i.test(name):
                    upload(config, true);
            }
        });
        return;
    }
    if (!config.privateKey) {
        console.log('⚠️ ', chalk_1.default.yellow('建议通过配置ssh私钥的方式来连接服务器!'));
        console.log(chalk_1.default.gray('配置ssh的方法：'));
        console.log(chalk_1.default.gray('1.命令行执行 ssh-keygen -f <文件名> 然后按照提示输入<密码>，完成后会在当前执行目录生成两个文件，不带.pub的是<私钥>，带.pub的是<公钥>'));
        console.log(chalk_1.default.gray('2.把<公钥>中的内容追加到服务器的/root/.ssh/authorized_keys文件中'));
        console.log(chalk_1.default.gray('3.把<密码>和<私钥>的内容分别添加到配置文件的字段passphrase和privateKey中就行了'));
        console.log(chalk_1.default.red('注意：私钥不要加到项目的版本控制系统中，防止泄露'));
    }
    //
    upload(config);
}
exports.start = start;
/**
 * 上传
 * @param config 配置信息
 * @param _false 是否假传
 */
function upload(config, _false) {
    if (_false === void 0) { _false = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, _a, _b, allP, _loop_2, _c, _d, _e;
        var _this = this;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    Manager_1.Manager.start(config, _false);
                    //
                    return [4 /*yield*/, Manager_1.Manager.beforeF()];
                case 1:
                    //
                    _f.sent();
                    if (!config.watch) return [3 /*break*/, 6];
                    _loop_1 = function (_b) {
                        var key, title, paths, connectConfig;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    key = _b.key, title = _b.title, paths = _b.paths, connectConfig = __rest(_b, ["key", "title", "paths"]);
                                    return [4 /*yield*/, Manager_1.Manager.execItemF(key, 'beforeF')];
                                case 1:
                                    _g.sent();
                                    Manager_1.Manager.getSftp(undefined, (0, IConfig_1.getConnectConfig)(connectConfig)).then(function (_a) {
                                        var conn = _a.conn, sftp = _a.sftp;
                                        return __awaiter(_this, void 0, void 0, function () {
                                            var _i, paths_2, _b, local, remote, ignored;
                                            return __generator(this, function (_c) {
                                                for (_i = 0, paths_2 = paths; _i < paths_2.length; _i++) {
                                                    _b = paths_2[_i], local = _b.local, remote = _b.remote, ignored = _b.ignored;
                                                    console.log(chalk_1.default.hex('#fddb3a')("\u76D1\u542C->".concat(title, "@").concat(key, ": ").concat((0, getAbsolute_1.getAbsolute)(local), " --> ").concat((0, getComPath_1.getComPath)(remote))));
                                                    console.log(chalk_1.default.gray('---->'));
                                                    (0, watchDf_1.watchDf)(key, (0, getAbsolute_1.getAbsolute)(local), (0, getComPath_1.getComPath)(remote), {
                                                        ignored: ignored,
                                                    }, sftp);
                                                }
                                                return [2 /*return*/];
                                            });
                                        });
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = config.syncList;
                    _f.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    _b = _a[_i];
                    return [5 /*yield**/, _loop_1(_b)];
                case 3:
                    _f.sent();
                    _f.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 13];
                case 6:
                    allP = [];
                    _loop_2 = function (_e) {
                        var key, title, paths, connectConfig;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    key = _e.key, title = _e.title, paths = _e.paths, connectConfig = __rest(_e, ["key", "title", "paths"]);
                                    return [4 /*yield*/, Manager_1.Manager.execItemF(key, 'beforeF')];
                                case 1:
                                    _h.sent();
                                    allP.push(Manager_1.Manager.getSftp(undefined, (0, IConfig_1.getConnectConfig)(connectConfig)).then(function (_a) {
                                        var conn = _a.conn, sftp = _a.sftp;
                                        return __awaiter(_this, void 0, void 0, function () {
                                            var _i, paths_3, _b, local, remote, ignored;
                                            return __generator(this, function (_c) {
                                                switch (_c.label) {
                                                    case 0:
                                                        _i = 0, paths_3 = paths;
                                                        _c.label = 1;
                                                    case 1:
                                                        if (!(_i < paths_3.length)) return [3 /*break*/, 4];
                                                        _b = paths_3[_i], local = _b.local, remote = _b.remote, ignored = _b.ignored;
                                                        console.log(chalk_1.default.hex('#fddb3a')("\u540C\u6B65->".concat(title, "@").concat(key, ": ").concat((0, getAbsolute_1.getAbsolute)(local), " --> ").concat((0, getComPath_1.getComPath)(remote))));
                                                        console.log(chalk_1.default.gray('---->'));
                                                        //同步
                                                        return [4 /*yield*/, (0, syncDF_1.syncDF)((0, getAbsolute_1.getAbsolute)(local), (0, getComPath_1.getComPath)(remote), sftp, ignored)];
                                                    case 2:
                                                        //同步
                                                        _c.sent();
                                                        _c.label = 3;
                                                    case 3:
                                                        _i++;
                                                        return [3 /*break*/, 1];
                                                    case 4:
                                                        //关闭连接
                                                        conn.end();
                                                        //
                                                        return [4 /*yield*/, Manager_1.Manager.execItemF(key, 'laterF')];
                                                    case 5:
                                                        //
                                                        _c.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    }));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _c = 0, _d = config.syncList;
                    _f.label = 7;
                case 7:
                    if (!(_c < _d.length)) return [3 /*break*/, 10];
                    _e = _d[_c];
                    return [5 /*yield**/, _loop_2(_e)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9:
                    _c++;
                    return [3 /*break*/, 7];
                case 10: return [4 /*yield*/, Promise.all(allP)];
                case 11:
                    _f.sent();
                    //
                    return [4 /*yield*/, Manager_1.Manager.laterF()];
                case 12:
                    //
                    _f.sent();
                    //
                    console.log(chalk_1.default.hex('#81b214')('\n同步完成'));
                    _f.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.upload = upload;
//# sourceMappingURL=index.js.map