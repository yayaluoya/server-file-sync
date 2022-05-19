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
exports.start = void 0;
var ssh2_1 = __importDefault(require("ssh2"));
var chalk_1 = __importDefault(require("chalk"));
var syncDF_1 = require("./syncDF");
var getAbsolute_1 = require("./utils/getAbsolute");
var watchDf_1 = require("./watchDf");
var getComPath_1 = require("./utils/getComPath");
var conn = new ssh2_1.default.Client();
/**
 * 开始服务
 */
function start(config) {
    var _this = this;
    conn.on('ready', function () {
        console.log(chalk_1.default.blue('连接成功...'));
        conn.sftp(function (err, sftp) { return __awaiter(_this, void 0, void 0, function () {
            var _i, _a, _b, title, local, remote, _c, _d, _e, title, local, remote;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (err) {
                            console.log(chalk_1.default.red('启动sftp失败'), err);
                            return [2 /*return*/];
                        }
                        if (!config.watch) return [3 /*break*/, 5];
                        _i = 0, _a = config.syncList;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], title = _b.title, local = _b.local, remote = _b.remote;
                        console.log(chalk_1.default.yellow("\u5F00\u59CB\u76D1\u542C@".concat(title).concat(local, "-->").concat(remote, "\n")));
                        return [4 /*yield*/, (0, watchDf_1.watchDf)(sftp, (0, getAbsolute_1.getAbsolute)(local), (0, getComPath_1.getComPath)(remote))];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 10];
                    case 5:
                        _c = 0, _d = config.syncList;
                        _f.label = 6;
                    case 6:
                        if (!(_c < _d.length)) return [3 /*break*/, 9];
                        _e = _d[_c], title = _e.title, local = _e.local, remote = _e.remote;
                        console.log(chalk_1.default.yellow("\u5F00\u59CB\u540C\u6B65@".concat(title).concat(local, "-->").concat(remote, "\n")));
                        return [4 /*yield*/, (0, syncDF_1.syncDF)(sftp, (0, getAbsolute_1.getAbsolute)(local), (0, getComPath_1.getComPath)(remote))];
                    case 7:
                        _f.sent();
                        _f.label = 8;
                    case 8:
                        _c++;
                        return [3 /*break*/, 6];
                    case 9:
                        //关闭连接
                        console.log(chalk_1.default.blue('\n同步完成'));
                        conn.end();
                        _f.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        }); });
    }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        privateKey: config.privateKey,
        passphrase: config.passphrase,
    });
}
exports.start = start;
//# sourceMappingURL=index.js.map