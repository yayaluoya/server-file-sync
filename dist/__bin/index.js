#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var packageJSON = require('../../package.json');
var defaultConfig = require('../../config');
var chalk_1 = __importDefault(require("chalk"));
var ObjectUtils_1 = require("yayaluoya-tool/dist/obj/ObjectUtils");
var getAbsolute_1 = require("../utils/getAbsolute");
var getOp_1 = require("./getOp");
var secondCom_1 = require("../utils/secondCom");
var defConfigName = 'sfs.config.js';
var defConfigUrl = path_1.default.join(process.cwd(), defConfigName);
/** 命令行选项 */
var opts = (0, getOp_1.getOp)();
/** 处理命令行的各个配置 */
switch (true) {
    case Boolean(opts.version):
        console.log(chalk_1.default.green('当前sfs版本@ ') + chalk_1.default.yellow(packageJSON.version));
        break;
    case Boolean(opts.help):
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
        break;
    case Boolean(opts.init):
        var p = Promise.resolve();
        if ((_a = fs_1.default.statSync(defConfigUrl, {
            throwIfNoEntry: false,
        })) === null || _a === void 0 ? void 0 : _a.isFile()) {
            p = (0, secondCom_1.secondCom)("\u5DF2\u7ECF\u5B58\u5728\u914D\u7F6E\u6587\u4EF6\u4E86".concat(defConfigUrl, "\uFF0C\u662F\u5426\u8986\u76D6 \u662F:y/Y \u8F93\u5165\u5176\u4ED6\u5B57\u7B26\u53D6\u6D88: ")).then(function (input) {
                if (!/^y$/i.test(input)) {
                    throw '';
                }
            });
        }
        p.then(function () {
            fs_1.default.createReadStream(path_1.default.join(__dirname, '../../config.js')).pipe(fs_1.default.createWriteStream(defConfigUrl));
            console.log(chalk_1.default.green("\u914D\u7F6E\u6587\u4EF6\u521B\u5EFA\u6210\u529F ".concat(defConfigUrl)));
        }).catch(function () {
            console.log('已取消');
        });
        break;
    case Boolean(opts.debugConfig):
        console.log(chalk_1.default.yellow('配置信息：'));
        if (typeof opts.debugConfig == 'string') {
            console.dir(ObjectUtils_1.ObjectUtils.merge(defaultConfig, getConfig((0, getAbsolute_1.getAbsolute)(opts.debugConfig), '配置文件导入错误!')), { depth: null });
        }
        else {
            console.dir(ObjectUtils_1.ObjectUtils.merge(defaultConfig, getCwdConfig()), { depth: null });
        }
        break;
    //开始
    default:
        //合并配置
        if (Boolean(opts.config)) {
            ObjectUtils_1.ObjectUtils.merge(defaultConfig, getConfig((0, getAbsolute_1.getAbsolute)(opts.config), '配置文件导入错误，将以默认配置运行!'));
        }
        else {
            ObjectUtils_1.ObjectUtils.merge(defaultConfig, getCwdConfig());
        }
        //正式运行
        (0, __1.start)(defaultConfig, (_b = opts.keys) === null || _b === void 0 ? void 0 : _b.split(/[,，]/), opts.demo);
}
/**
 * 获取cwd配置文件
 * @returns
 */
function getCwdConfig() {
    return getConfig(defConfigUrl, '配置文件导入错误!');
}
/**
 * 获取自定义的配置文件
 * @param _url
 * @param a 提示信息
 */
function getConfig(_url, a) {
    var config = {};
    try {
        config = require(_url);
    }
    catch (e) {
        if (a) {
            console.log(chalk_1.default.red(a));
            console.log(e);
        }
    }
    return config;
}
//# sourceMappingURL=index.js.map