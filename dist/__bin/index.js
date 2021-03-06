#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var commander_1 = require("commander");
var packageJSON = require('../../package.json');
var defaultConfig = require('../../config');
var program = new commander_1.Command();
var chalk_1 = __importDefault(require("chalk"));
var ObjectUtils_1 = require("../utils/ObjectUtils");
var getAbsolute_1 = require("../utils/getAbsolute");
var cuConfigName = 'sfs.config.js';
program.option('-v --version')
    .option('-h --help')
    .option('-i --init')
    .option('-c --config <path>')
    .option('-dc --debug-config [path]')
    .option('-k --keys <keys>')
    .option('-d --demo');
program.parse(process.argv);
var opts = program.opts();
switch (true) {
    case Boolean(opts.version):
        console.log(chalk_1.default.green('当前sfs版本@ ') + chalk_1.default.yellow(packageJSON.version));
        break;
    case Boolean(opts.help):
        console.log(chalk_1.default.yellow('sfs的所有命令：'));
        console.log(chalk_1.default.green('   -v --version ') + chalk_1.default.gray('查看当前工具版本'));
        console.log(chalk_1.default.green('   -h --help ') + chalk_1.default.gray('查看所有的命令和帮助信息'));
        console.log(chalk_1.default.green('   -i --init ') + chalk_1.default.gray('在当前执行目录下生成默认配置文件'));
        console.log(chalk_1.default.green('   -c --config <path> ') + chalk_1.default.gray('用指定配置文件来运行'));
        console.log(chalk_1.default.green('   -dc --debug-config [path] ') + chalk_1.default.gray('查看某个配置文件'));
        console.log(chalk_1.default.green('   -k --keys <keys> ') + chalk_1.default.gray('指定配置列表中的那些项目参与此次同步，多个项目用,号分隔'));
        console.log(chalk_1.default.green('   -d --demo ') + chalk_1.default.gray('同步时需要再次确定才会真正同步，在重要场合加上这个参数可以防止出错'));
        console.log(chalk_1.default.yellow('sfs的使用方式：'));
        console.log(chalk_1.default.gray('    完整命令为server-file-sync，快捷命令为sfs'));
        console.log(chalk_1.default.gray('    默认自定义配置是当前工具执行路径下的sfs.config.js文件，可以执行sfs -i 快速生成配置文件'));
        break;
    case Boolean(opts.init):
        fs_1.default.createReadStream(path_1.default.join(__dirname, '../../config.js')).pipe(fs_1.default.createWriteStream(path_1.default.join(process.cwd(), cuConfigName)));
        console.log(chalk_1.default.green('配置文件创建成功'));
        break;
    case Boolean(opts.debugConfig):
        console.log(chalk_1.default.yellow('配置信息：'));
        if (typeof opts.debugConfig == 'string') {
            console.log(ObjectUtils_1.ObjectUtils.merge(defaultConfig, getConfig((0, getAbsolute_1.getAbsolute)(opts.debugConfig), '配置文件导入错误!')));
        }
        else {
            console.log(ObjectUtils_1.ObjectUtils.merge(defaultConfig, getCwdConfig()));
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
        (0, __1.start)(defaultConfig, (_a = opts.keys) === null || _a === void 0 ? void 0 : _a.split(','), opts.demo);
}
/**
 * 获取cwd配置文件
 * @returns
 */
function getCwdConfig() {
    return getConfig(path_1.default.join(process.cwd(), cuConfigName), '配置文件导入错误!');
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