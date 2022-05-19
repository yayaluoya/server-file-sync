/**
 * 配置文件类型
 */
export interface IConfig {
    /** 配置名字 */
    name: string;
    /** 私钥密码 */
    passphrase: string;
    /** 私钥字符串 */
    privateKey: string;
    /** 同步列表 */
    syncList: {
        /** 标题 */
        title: string;
        /** 本地地址 */
        local: string;
        /** 远程地址 */
        remote: string;
    }[];
}

/**
 * 配置文件
 */
export class Config {
    /** 主配置文件 */
    static mainConfig: IConfig;
}