import chalk from "chalk";
import path from "path";
import { TConfig } from "./IConfig";

/**
 * 包配置文件
 */
export const packageJSON: {
    /** 名字 */
    name: string;
    /** 版本号 */
    version: string;
    /** 描述 */
    description: string;
} = require('../../package.json');
/**
 * 默认配置
 */
export const defaultConfig = getConfig(path.join(__dirname, '../../config'));
/**
 * 项目配置文件名字
 */
export const projectConfigName = 'sfs.config.js';
/**
 * 项目配置文件地址
 */
export const projectConfigUrl = path.join(process.cwd(), projectConfigName);

/**
 * 获取cwd配置文件
 * @returns 
 */
export function getCwdConfig() {
    return getConfig(projectConfigUrl, '配置文件导入错误!')
}

/**
 * 根据路径获取自定义的配置文件
 * @param _url 
 * @param a 提示信息 
 */
export function getConfig(_url: string, a?: string): Promise<TConfig> {
    let config = Promise.resolve({});
    try {
        config = Promise.resolve(require(_url));
    } catch (e) {
        if (a) {
            console.log(chalk.red(a));
            console.log(e);
        }
    }
    return config;
}