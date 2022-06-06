import { Client, SFTPWrapper } from "ssh2";
import { type Matcher } from 'anymatch';

/**
 * 配置文件类型
 */
export interface IConfig {
    /** 配置名字 */
    name: string;
    /** 主机地址 */
    host: string,
    /** 端口号 */
    port: number,
    /** 用户名 */
    username: string,
    /** 私钥密码 */
    passphrase: string;
    /** 私钥字符串 */
    privateKey: string;
    /** 同步列表 */
    syncList: {
        /** key */
        key: string;
        /** 标题 */
        title: string;
        /** 路径列表 */
        paths: {
            /** 本地地址 */
            local: string;
            /** 远程地址 */
            remote: string;
            /** 文件忽略，请注意不支持 Windows 样式的反斜杠作为分隔符*/
            ignored?: Matcher;
        }[],
    }[];
    /** 是否监听 */
    watch: boolean;
    /** 更新回调 */
    updateF?: (conn: Client, key: string) => Promise<any>;
}

/**
 * 管理器
 */
export class Manager {
    /** 主配置文件 */
    static mainConfig: IConfig;
    /** 连接句柄 */
    static conn: Client;
    /** sftp句柄 */
    static sftp: SFTPWrapper;
}