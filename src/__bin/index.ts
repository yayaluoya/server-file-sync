#!/usr/bin/env node
import { start } from "..";
import path from "path";
import fs from "fs";
import { IConfig } from "../Manager";
const packageJSON = require('../../package.json');
const defaultConfig = require('../../config');
import chalk from "chalk";
import { ObjectUtils } from "yayaluoya-tool/dist/obj/ObjectUtils";
import { getAbsolute } from "../utils/getAbsolute";
import { getOp } from "./getOp";
import { secondCom } from "../utils/secondCom";

const defConfigName = 'sfs.config.js';
const defConfigUrl = path.join(process.cwd(), defConfigName);

/** 命令行选项 */
const opts = getOp();

/** 处理命令行的各个配置 */
switch (true) {
    case Boolean(opts.version):
        console.log(chalk.green('当前sfs版本@ ') + chalk.yellow(packageJSON.version));
        break;
    case Boolean(opts.help):
        console.log('\n');
        console.log(chalk.hex('#d2e603')('sfs的所有命令😀:'));
        console.log(chalk.green('   -v --version ') + chalk.gray('查看当前工具版本'));
        console.log(chalk.green('   -h --help ') + chalk.gray('查看所有的命令和帮助信息'));
        console.log(chalk.green('   -i --init ') + chalk.gray('在当前执行目录下生成默认配置文件'));
        console.log(chalk.green('   -c --config <path> ') + chalk.gray('用指定配置文件来运行'));
        console.log(chalk.green('   -dc --debug-config [path] ') + chalk.gray('查看某个配置文件'));
        console.log(chalk.green('   -k --keys <keys> ') + chalk.gray('指定配置列表中的那些项目参与此次同步，多个项目用,，号分隔'));
        console.log(chalk.green('   -d --demo ') + chalk.gray('同步时需要再次确定才会真正同步，在重要场合加上这个参数可以防止出错'));
        console.log('----');
        console.log(chalk.yellow('sfs的使用方式⚡：'));
        console.log(chalk.gray('    完整命令为server-file-sync，快捷命令为sfs'));
        console.log(chalk.gray('    默认自定义配置是当前工具执行路径下的sfs.config.js文件，可以执行sfs -i 快速生成配置文件'));
        break;
    case Boolean(opts.init):
        let p = Promise.resolve();
        if (fs.statSync(defConfigUrl, {
            throwIfNoEntry: false,
        })?.isFile()) {
            p = secondCom(`已经存在配置文件了${defConfigUrl}，是否覆盖 是:y/Y 输入其他字符取消: `).then((input) => {
                if (!/^y$/i.test(input)) {
                    throw '';
                }
            })
        }
        p.then(() => {
            fs.createReadStream(path.join(__dirname, '../../config.js')).pipe(fs.createWriteStream(defConfigUrl));
            console.log(chalk.green(`配置文件创建成功 ${defConfigUrl}`));
        }).catch(() => {
            console.log('已取消');
        });
        break;
    case Boolean(opts.debugConfig):
        console.log(chalk.yellow('配置信息：'));
        if (typeof opts.debugConfig == 'string') {
            console.dir(
                ObjectUtils.merge(defaultConfig, getConfig(getAbsolute(opts.debugConfig), '配置文件导入错误!')),
                { depth: null }
            );
        } else {
            console.dir(
                ObjectUtils.merge(defaultConfig, getCwdConfig()),
                { depth: null }
            );
        }
        break;
    //开始
    default:
        //合并配置
        if (Boolean(opts.config)) {
            ObjectUtils.merge(defaultConfig, getConfig(getAbsolute(opts.config), '配置文件导入错误，将以默认配置运行!'))
        } else {
            ObjectUtils.merge(defaultConfig, getCwdConfig())
        }
        //正式运行
        start(defaultConfig, opts.keys?.split(/[,，]/), opts.demo);
}


/**
 * 获取cwd配置文件
 * @returns 
 */
function getCwdConfig(): IConfig {
    return getConfig(defConfigUrl, '配置文件导入错误!')
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