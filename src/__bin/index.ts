#!/usr/bin/env node
import { start } from "..";
import path from "path";
import fs from "fs";
import { Command } from 'commander';
import { IConfig } from "../Manager";
const packageJSON = require('../../package.json');
const defaultConfig = require('../../config');
const program = new Command();
import chalk from "chalk";
import { ObjectUtils } from "../utils/ObjectUtils";
import { getAbsolute } from "../utils/getAbsolute";

const cuConfigName = 'sfs.config.js';

program.option('-v --version')
    .option('-h --help')
    .option('-i --init')
    .option('-c --config <path>')
    .option('-dc --debug-config [path]')
    .option('-k --keys <keys>')
    .option('-d --demo')

program.parse(process.argv);
let opts = program.opts();

switch (true) {
    case Boolean(opts.version):
        console.log(chalk.green('当前sfs版本@ ') + chalk.yellow(packageJSON.version));
        break;
    case Boolean(opts.help):
        console.log(chalk.yellow('sfs的所有命令：'));
        console.log(chalk.green('   -v --version ') + chalk.gray('查看当前工具版本'));
        console.log(chalk.green('   -h --help ') + chalk.gray('查看所有的命令和帮助信息'));
        console.log(chalk.green('   -i --init ') + chalk.gray('在当前执行目录下生成默认配置文件'));
        console.log(chalk.green('   -c --config <path> ') + chalk.gray('用指定配置文件来运行'));
        console.log(chalk.green('   -dc --debug-config [path] ') + chalk.gray('查看某个配置文件'));
        console.log(chalk.green('   -k --keys <keys> ') + chalk.gray('指定配置列表中的那些项目参与此次同步，用,号分隔'));
        console.log(chalk.green('   -d --demo ') + chalk.gray('显示当前可能会参与同步的项目，需要再次确定才会真正同步，在重要场合加上这个参数可以防止出错'));
        console.log(chalk.yellow('sfs的使用方式：'));
        console.log(chalk.gray('    完整命令为server-file-sync，快捷命令为sfs'));
        console.log(chalk.gray('    默认自定义配置是当前工具执行路径下的sfs.config.js文件'));
        break;
    case Boolean(opts.init):
        fs.createReadStream(path.join(__dirname, '../../config.js')).pipe(fs.createWriteStream(path.join(process.cwd(), cuConfigName)));
        console.log(chalk.green('配置文件创建成功'));
        break;
    case Boolean(opts.debugConfig):
        console.log(chalk.yellow('配置信息：'));
        if (typeof opts.debugConfig == 'string') {
            console.log(ObjectUtils.merge(defaultConfig, getConfig(getAbsolute(opts.debugConfig), '查找配置失败!')));
        } else {
            console.log(ObjectUtils.merge(defaultConfig, getCwdConfig()));
        }
        break;
    //开始
    default:
        //合并配置
        if (Boolean(opts.config)) {
            ObjectUtils.merge(defaultConfig, getConfig(getAbsolute(opts.config), '查找配置失败，将以默认配置运行!'))
        } else {
            ObjectUtils.merge(defaultConfig, getCwdConfig())
        }
        //正式运行
        start(defaultConfig, opts.keys?.split(','), opts.demo);
}


/**
 * 获取cwd配置文件
 * @returns 
 */
function getCwdConfig(): IConfig {
    return getConfig(path.join(process.cwd(), cuConfigName))
}

/**
 * 获取自定义的配置文件
 * @param _url 
 * @param a 提示信息 
 */
function getConfig(_url: string, a?: string): IConfig {
    let config = {};
    try {
        config = require(_url);
    } catch (e) {
        if (a) {
            console.log(chalk.red(a));
            console.log(e);
        }
    }
    return config as any;
}