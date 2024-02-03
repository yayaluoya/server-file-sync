import chalk from 'chalk';
import path from 'path';
import { TConfig, TConnectConfig } from './TConfig';
import { PathManger } from '../manager/PathManger';

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
  /** 维护人员 */
  author: string;
  /** 主页 */
  homepage: string;
  /** 问题 */
  issues: string;
} = require('../../package.json');

/**
 * 获取默认配置
 * @returns
 */
export function getDefConfig(): TConfig {
  return {
    host: '',
    port: 22,
    username: 'root',
    syncList: [],
    connectConfig: {},
    watch: false,
  };
}

/**
 * 获取项目默认配置文件名字
 */
export function getProjectDefConfigName() {
  return `sfs-v${packageJSON.version.split('.')[0]}.config.js`;
}

/**
 * 模板配置文件地址
 */
export const temConfigPath = path.join(PathManger.toolRootPath, './config_tem.js');

/**
 * 获取项目默认配置文件
 * @returns
 */
export function getProjectDefConfig() {
  return getConfig(
    path.join(PathManger.cwd, getProjectDefConfigName()),
    `配置文件导入错误，请运行 ${packageJSON.name} -i 命令生成配置文件`,
  );
}

/**
 * 从一个对象中提取ssh2的连接配置
 * @param obj
 * @returns
 */
export function getConnectConfig(obj: TConnectConfig & Record<string, any>) {
  let o: TConnectConfig = {};
  'host' in obj && (o.host = obj.host);
  'port' in obj && (o.port = obj.port);
  'username' in obj && (o.username = obj.username);
  'passphrase' in obj && (o.passphrase = obj.passphrase);
  'privateKey' in obj && (o.privateKey = obj.privateKey);
  return o;
}

/**
 * 根据路径获取自定义的配置文件
 * @param path 配置文件路径
 * @param errF 提示信息，或是处理错误的方法
 */
export function getConfig(
  path: string,
  errF?: ((err: any) => void) | string,
): Promise<TConfig> {
  let config = Promise.resolve(getDefConfig());
  try {
    let _ = require(path);
    config = Promise.resolve(typeof _ == 'function' ? _() : _);
  } catch (err) {
    if (typeof errF == 'string') {
      console.log(chalk.red(errF));
      console.log(err);
    } else if (typeof errF == 'function') {
      errF(err);
    }
  }
  return config;
}
