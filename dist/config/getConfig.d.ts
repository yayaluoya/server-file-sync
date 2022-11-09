import { TConfig } from "./IConfig";
/**
 * 包配置文件
 */
export declare const packageJSON: {
    /** 名字 */
    name: string;
    /** 版本号 */
    version: string;
    /** 描述 */
    description: string;
};
/**
 * 默认配置
 */
export declare const defaultConfig: Promise<TConfig>;
/**
 * 项目配置文件名字
 */
export declare const projectConfigName = "sfs.config.js";
/**
 * 项目配置文件地址
 */
export declare const projectConfigUrl: string;
/**
 * 获取cwd配置文件
 * @returns
 */
export declare function getCwdConfig(): Promise<TConfig>;
/**
 * 根据路径获取自定义的配置文件
 * @param _url
 * @param a 提示信息
 */
export declare function getConfig(_url: string, a?: string): Promise<TConfig>;
//# sourceMappingURL=getConfig.d.ts.map