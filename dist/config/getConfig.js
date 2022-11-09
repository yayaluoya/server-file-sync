"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.getCwdConfig = exports.projectConfigUrl = exports.projectConfigName = exports.defaultConfig = exports.packageJSON = void 0;
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
/**
 * 包配置文件
 */
exports.packageJSON = require('../../package.json');
/**
 * 默认配置
 */
exports.defaultConfig = getConfig(path_1.default.join(__dirname, '../../config'));
/**
 * 项目配置文件名字
 */
exports.projectConfigName = 'sfs.config.js';
/**
 * 项目配置文件地址
 */
exports.projectConfigUrl = path_1.default.join(process.cwd(), exports.projectConfigName);
/**
 * 获取cwd配置文件
 * @returns
 */
function getCwdConfig() {
    return getConfig(exports.projectConfigUrl, '配置文件导入错误!');
}
exports.getCwdConfig = getCwdConfig;
/**
 * 根据路径获取自定义的配置文件
 * @param _url
 * @param a 提示信息
 */
function getConfig(_url, a) {
    var config = Promise.resolve({});
    try {
        config = Promise.resolve(require(_url));
    }
    catch (e) {
        if (a) {
            console.log(chalk_1.default.red(a));
            console.log(e);
        }
    }
    return config;
}
exports.getConfig = getConfig;
//# sourceMappingURL=getConfig.js.map