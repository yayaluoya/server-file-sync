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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchDf = void 0;
var chokidar_1 = __importDefault(require("chokidar"));
var path_1 = __importDefault(require("path"));
var getComPath_1 = require("./utils/getComPath");
var Manager_1 = require("./Manager");
/**
 * 同步目录和文件
 * @param key 唯一键值
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 * @param op 选项
 */
function watchDf(key, localDir, remoteDir, op) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            chokidar_1.default.watch(localDir, {
                ignored: op.ignored || [],
            }).on('all', function (event, _path) { return __awaiter(_this, void 0, void 0, function () {
                var relativePath, onRemotePath;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(event == 'add' || event == 'change')) return [3 /*break*/, 2];
                            relativePath = path_1.default.relative(localDir, _path);
                            onRemotePath = path_1.default.join(remoteDir, relativePath);
                            //创建目录
                            return [4 /*yield*/, mkDir(remoteDir, path_1.default.dirname(relativePath))];
                        case 1:
                            //创建目录
                            _a.sent();
                            //同步
                            Manager_1.Manager.fastPut(_path, (0, getComPath_1.getComPath)(onRemotePath)).then(function () {
                                //触发更新回调
                                Manager_1.Manager.updateF(key);
                            });
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.watchDf = watchDf;
/**
 * 创建目录
 * @param rootPath 相对目录
 * @param _path
 */
function mkDir(rootPath, _path) {
    return __awaiter(this, void 0, void 0, function () {
        var _paths, i, len, dir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _paths = (0, getComPath_1.getComPath)(_path).split('/');
                    i = 0, len = _paths.length;
                    _a.label = 1;
                case 1:
                    if (!(i < len)) return [3 /*break*/, 4];
                    dir = path_1.default.join.apply(path_1.default, __spreadArray([rootPath], _paths.slice(0, i + 1), false));
                    //
                    if ((0, getComPath_1.getComPath)(dir) == (0, getComPath_1.getComPath)(rootPath)) {
                        return [3 /*break*/, 3];
                    }
                    //
                    return [4 /*yield*/, Manager_1.Manager.mkdir((0, getComPath_1.getComPath)(dir))];
                case 2:
                    //
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=watchDf.js.map