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
exports.syncDF = void 0;
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var getComPath_1 = require("./utils/getComPath");
/**
 * 同步目录和文件
 * @param sftp 操作句柄
 * @param localDir 本地目录
 * @param remoteDir 远程目录
 */
function syncDF(sftp, localDir, remoteDir) {
    return __awaiter(this, void 0, void 0, function () {
        var stat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    stat = fs_1.default.statSync(localDir);
                    if (!stat.isFile()) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (r, e) {
                            //上传
                            sftp.fastPut(localDir, (0, getComPath_1.getComPath)(remoteDir), function (err) {
                                if (err) {
                                    console.log(chalk_1.default.red('上传失败!', localDir, remoteDir));
                                    e();
                                    return;
                                }
                                console.log(chalk_1.default.gray('上传'), localDir, chalk_1.default.gray('-->'), chalk_1.default.green(remoteDir));
                                r();
                            });
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!stat.isDirectory()) return [3 /*break*/, 5];
                    //创建目录
                    return [4 /*yield*/, new Promise(function (r) {
                            sftp.mkdir((0, getComPath_1.getComPath)(remoteDir), function () {
                                r();
                            });
                        })];
                case 3:
                    //创建目录
                    _a.sent();
                    //
                    return [4 /*yield*/, Promise.all(fs_1.default.readdirSync(localDir).map(function (o) {
                            return syncDF(sftp, path_1.default.join(localDir, o), path_1.default.join(remoteDir, o));
                        }))];
                case 4:
                    //
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.syncDF = syncDF;
//# sourceMappingURL=syncDF.js.map