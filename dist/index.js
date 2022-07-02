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
exports.start = exports.getConfig = void 0;
var Manager_1 = require("./Manager");
var chalk_1 = __importDefault(require("chalk"));
var syncDF_1 = require("./syncDF");
var getAbsolute_1 = require("./utils/getAbsolute");
var watchDf_1 = require("./watchDf");
var getComPath_1 = require("./utils/getComPath");
var readline = require('readline');
/**
 * 获取配置
 * 主要是为外界提供ts的能力
 * @param c
 * @returns
 */
function getConfig(c) {
    return c;
}
exports.getConfig = getConfig;
/**
 * 开始服务
 */
function start(config, keys, demo) {
    if (demo === void 0) { demo = false; }
    //对config中的列表做判断
    if (keys && keys.length > 0) {
        config.syncList = config.syncList.filter(function (_) {
            return keys.includes(_.key);
        });
    }
    if (!config.syncList || config.syncList.length == 0) {
        console.log(chalk_1.default.red('没有需要同步的内容，请在配置syncList中添加需要同步的列表'));
        return;
    }
    //如果是演示的话需要再次确定
    if (demo) {
        for (var _i = 0, _a = config.syncList; _i < _a.length; _i++) {
            var _b = _a[_i], key = _b.key, title = _b.title, paths = _b.paths;
            for (var _c = 0, paths_1 = paths; _c < paths_1.length; _c++) {
                var _d = paths_1[_c], local = _d.local, remote = _d.remote;
                console.log(chalk_1.default.yellow("\u540C\u6B65->".concat(title, "@").concat(key, ": ").concat((0, getAbsolute_1.getAbsolute)(local), " -> ").concat((0, getComPath_1.getComPath)(remote), "\n")));
            }
        }
        var rl_1 = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // ask user for the anme input
        rl_1.question(chalk_1.default.cyan('上传:y/Y,演示:d/D 输入其它字符取消: '), function (name) {
            rl_1.close();
            switch (true) {
                /** 上传 */
                case /^y$/i.test(name):
                    start_(config);
                    break;
                /** 演示 */
                case /^d$/i.test(name):
                    start_(config, true);
            }
        });
        return;
    }
    if (!config.privateKey) {
        console.log(chalk_1.default.yellow('建议通过配置ssh私钥的方式来连接服务器!'));
        console.log('配置ssh的方法：');
        console.log(chalk_1.default.gray('1.命令行执行 ssh-keygen -f <文件名> 然后按照提示输入<密码>，完成后会在当前执行目录生成两个文件，不带.pub的是<私钥>，带.pub的是<公钥>'));
        console.log(chalk_1.default.gray('2.把<公钥>中的内容追加到服务器的/root/.ssh/authorized_keys文件中'));
        console.log(chalk_1.default.gray('3.把<密码>和<私钥>的内容分别添加到配置文件的字段passphrase和privateKey中就行了'));
        console.log(chalk_1.default.red('注意：私钥不要加到项目的版本控制系统中'));
    }
    //
    start_(config);
}
exports.start = start;
/**
 * 正式启动
 * @param config
 */
function start_(config, _false) {
    var _this = this;
    if (_false === void 0) { _false = false; }
    //
    Manager_1.Manager.connect(config, _false).then(function (_a) {
        var conn = _a.conn, sftp = _a.sftp;
        return __awaiter(_this, void 0, void 0, function () {
            var _i, _b, _c, key, title, paths, _d, paths_2, _e, local, remote, ignored, _f, _g, _h, key, title, paths, _j, paths_3, _k, local, remote, ignored;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0:
                        if (!config.watch) return [3 /*break*/, 7];
                        _i = 0, _b = config.syncList;
                        _l.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 6];
                        _c = _b[_i], key = _c.key, title = _c.title, paths = _c.paths;
                        _d = 0, paths_2 = paths;
                        _l.label = 2;
                    case 2:
                        if (!(_d < paths_2.length)) return [3 /*break*/, 5];
                        _e = paths_2[_d], local = _e.local, remote = _e.remote, ignored = _e.ignored;
                        console.log(chalk_1.default.yellow("\u76D1\u542C->".concat(title, "@").concat(key, ": ").concat((0, getAbsolute_1.getAbsolute)(local), " -> ").concat((0, getComPath_1.getComPath)(remote), "\n")));
                        return [4 /*yield*/, (0, watchDf_1.watchDf)(key, (0, getAbsolute_1.getAbsolute)(local), (0, getComPath_1.getComPath)(remote), {
                                ignored: ignored,
                            })];
                    case 3:
                        _l.sent();
                        _l.label = 4;
                    case 4:
                        _d++;
                        return [3 /*break*/, 2];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 16];
                    case 7:
                        _f = 0, _g = config.syncList;
                        _l.label = 8;
                    case 8:
                        if (!(_f < _g.length)) return [3 /*break*/, 15];
                        _h = _g[_f], key = _h.key, title = _h.title, paths = _h.paths;
                        _j = 0, paths_3 = paths;
                        _l.label = 9;
                    case 9:
                        if (!(_j < paths_3.length)) return [3 /*break*/, 12];
                        _k = paths_3[_j], local = _k.local, remote = _k.remote, ignored = _k.ignored;
                        console.log(chalk_1.default.yellow("\u540C\u6B65->".concat(title, "@").concat(key, ": ").concat((0, getAbsolute_1.getAbsolute)(local), " -> ").concat((0, getComPath_1.getComPath)(remote), "\n")));
                        //同步
                        return [4 /*yield*/, (0, syncDF_1.syncDF)((0, getAbsolute_1.getAbsolute)(local), (0, getComPath_1.getComPath)(remote), ignored)];
                    case 10:
                        //同步
                        _l.sent();
                        _l.label = 11;
                    case 11:
                        _j++;
                        return [3 /*break*/, 9];
                    case 12: 
                    //触发更新回调
                    return [4 /*yield*/, Manager_1.Manager.updateF(key)];
                    case 13:
                        //触发更新回调
                        _l.sent();
                        _l.label = 14;
                    case 14:
                        _f++;
                        return [3 /*break*/, 8];
                    case 15:
                        //关闭连接
                        console.log(chalk_1.default.green('\n同步完成'));
                        conn.end();
                        _l.label = 16;
                    case 16: return [2 /*return*/];
                }
            });
        });
    });
}
//# sourceMappingURL=index.js.map