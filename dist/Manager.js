"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Manager = void 0;
var ssh2_1 = __importDefault(require("ssh2"));
var chalk_1 = __importDefault(require("chalk"));
var getComPath_1 = require("./utils/getComPath");
var moment_1 = __importDefault(require("moment"));
var fs_1 = __importDefault(require("fs"));
var IConfig_1 = require("./config/IConfig");
/**
 * 管理器
 */
var Manager = /** @class */ (function () {
    function Manager() {
    }
    /**
     * 开始
     */
    Manager.start = function (config, _false) {
        if (_false === void 0) { _false = false; }
        if (this.start_) {
            return;
        }
        this.start_ = true;
        this._false = _false;
        this.mainConfig = config;
        return this;
    };
    /**
     * 通过key获取配置
     * @param key
     */
    Manager.byKeyGetConfig = function (key) {
        return this.mainConfig.syncList.find(function (_) {
            return _.key == key;
        });
    };
    /**
     * 执行某一个同步项的某一个回调
     * @param key
     * @param fKey
     */
    Manager.execItemF = function (key, fKey) {
        var _this = this;
        var _a;
        var onItem = this.byKeyGetConfig(key);
        if (onItem) {
            return Promise.resolve((_a = onItem[fKey]) === null || _a === void 0 ? void 0 : _a.call(onItem, function () {
                return _this.getConn(fKey, (0, IConfig_1.getConnectConfig)(onItem));
            }));
        }
    };
    /**
     * 获取一个连接实例
     * @param title
     * @param connectConfig
     * @returns
     */
    Manager.getConn = function (title, connectConfig) {
        var _this = this;
        if (title === void 0) { title = ''; }
        return new Promise(function (r) {
            var conn = new ssh2_1.default.Client();
            //连接
            var op = __assign(__assign(__assign({}, _this.mainConfig.connectConfig), (0, IConfig_1.getConnectConfig)(_this.mainConfig)), connectConfig);
            var errF = function (err) {
                console.log(chalk_1.default.red('服务器连接错误\n'), err);
                console.log(chalk_1.default.red('错误配置'));
                console.dir(op, { depth: null });
            };
            try {
                conn.connect(op).on('ready', function () {
                    title && console.log(chalk_1.default.blue("\n\u670D\u52A1\u5668\u8FDE\u63A5".concat(title ? ':' + title : '', "\n")));
                    r(conn);
                }).on('error', errF);
            }
            catch (err) {
                errF(err);
            }
        });
    };
    /**
     * 获取一个sftp实例
     * @param title
     * @param connectConfig
     */
    Manager.getSftp = function (title, connectConfig) {
        if (title === void 0) { title = ''; }
        return this.getConn(title, connectConfig).then(function (conn) {
            return new Promise(function (r, e) {
                //建立sftp连接
                conn.sftp(function (err, sftp) {
                    if (err) {
                        title && console.log(chalk_1.default.red("sftp\u8FDE\u63A5\u5931\u8D25!".concat(title ? ':' + title : '', "\n")), err);
                        e();
                        return;
                    }
                    r({
                        conn: conn,
                        sftp: sftp,
                    });
                });
            });
        });
    };
    /**
     * 同步之前的回调
     */
    Manager.beforeF = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (this._false ||
                            Promise.resolve((_b = (_a = this.mainConfig).beforeF) === null || _b === void 0 ? void 0 : _b.call(_a, function (op) {
                                return _this.getConn('beforeF', op);
                            }))
                                .catch(function (e) {
                                console.log(chalk_1.default.red('执行beforeF出错:'), e);
                            }))];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 完成的回调
     */
    Manager.laterF = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, (this._false ||
                            Promise.resolve((_b = (_a = this.mainConfig).laterF) === null || _b === void 0 ? void 0 : _b.call(_a, function (op) {
                                return _this.getConn('laterF', op);
                            }))
                                .catch(function (e) {
                                console.log(chalk_1.default.red('执行laterF出错:'), e);
                            }))];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 同步文件
     */
    Manager.fastPut = function (_path, _remotePath, sftp) {
        var _this = this;
        return new Promise(function (r, e) {
            //假连接就不传
            if (_this._false) {
                var fileState = fs_1.default.statSync(_path);
                console.log(chalk_1.default.hex('#eebb4d')('同步演示'), _path, fileState.size / 1000 + 'KB', chalk_1.default.gray('-->'), chalk_1.default.green((0, getComPath_1.getComPath)(_remotePath)), chalk_1.default.gray((0, moment_1.default)().format('HH:mm:ss')));
                r();
                return;
            }
            //同步
            sftp.fastPut(_path, _remotePath, function (err) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err) {
                        console.log(chalk_1.default.red('同步失败!', _path, _remotePath), err);
                        e(err);
                        return [2 /*return*/];
                    }
                    console.log(chalk_1.default.gray('同步成功'), _path, chalk_1.default.gray('-->'), chalk_1.default.green((0, getComPath_1.getComPath)(_remotePath)), chalk_1.default.gray((0, moment_1.default)().format('HH:mm:ss')));
                    r();
                    return [2 /*return*/];
                });
            }); });
        });
    };
    /**
     * 创建目录
     * 不管成功失败，都返回的成功解决的promise
     */
    Manager.mkdir = function (dir, sftp) {
        var _this = this;
        return new Promise(function (r, e) {
            //假连接不做操作
            if (_this._false) {
                r();
                return;
            }
            sftp.mkdir(dir, function (err) {
                r();
            });
        });
    };
    Manager.start_ = false;
    return Manager;
}());
exports.Manager = Manager;
//# sourceMappingURL=Manager.js.map